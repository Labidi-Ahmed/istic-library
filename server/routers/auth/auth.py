import os
from fastapi import APIRouter, Depends, HTTPException, Response
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.requests import Request
from fastapi.responses import RedirectResponse, HTMLResponse
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy import insert
from starlette.config import Config
from .auth_service import (
    set_session_token_cookie,
    generate_session_token,
    create_session,
    delete_session_token_cookie,
)
from models import User, UserSession
from db import get_db
from dependencies.session import get_user
import logging


logger = logging.getLogger("uvicorn")

router = APIRouter(prefix="/auth", tags=["auth"])

config = Config(".env")
oauth = OAuth(config)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:7000")

oauth.register(
    name="google",
    client_id=config("GOOGLE_CLIENT_ID"),
    client_secret=config("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    if not redirect_uri:
        raise HTTPException(status_code=400, detail="Redirect URI not configured")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback")
async def auth_callback(
    request: Request, response: Response, db: Session = Depends(get_db)
):
    try:
        token = await oauth.google.authorize_access_token(request)
        user = token.get("userinfo")

        if not user:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        existing_user = db.query(User).filter(User.email == user["email"]).first()

        user_id = None
        if not existing_user:
            new_user = User(
                email=user["email"],
                username=user["name"],
                picture=user.get("picture"),
                createdAt=datetime.utcnow(),
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            user_id = new_user.id
        else:
            user_id = existing_user.id

        session_token = generate_session_token()
        user_session = await create_session(
            token=session_token,
            userId=user_id,
            db=db,
        )

        redirect_response = RedirectResponse(
            url=FRONTEND_URL, status_code=303
        )
        set_session_token_cookie(
            response=redirect_response,
            token=session_token,
            expires_at=datetime.utcnow() + timedelta(days=30),
        )

        return redirect_response

    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")


@router.post("/logout")
async def logout(request: Request, response: Response, user=Depends(get_user)):
    response = RedirectResponse(url=FRONTEND_URL)
    delete_session_token_cookie(response)
    return response


@router.get("/check-auth")
async def check_auth(request: Request, user=Depends(get_user)):
    if not user:
        return {"isAuthenticated": False, "user": None}
    return {"isAuthenticated": True, "user": user}
