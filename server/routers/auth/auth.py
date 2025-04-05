import os
from fastapi import APIRouter, Depends, HTTPException, Response
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy import insert
from starlette.config import Config
from .auth_service import (
    set_session_token_cookie,
    generate_session_token,
    create_session,
)
from models import User, Session
from db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

config = Config(".env")
oauth = OAuth(config)


oauth.register(
    name="google",
    client_id=config("GOOGLE_CLIENT_ID"),
    client_secret=config("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = config("GOOGLE_REDIRECT_URI")
    if not redirect_uri:
        raise HTTPException(status_code=400, detail="Redirect URI not configured")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
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

        await create_session(
            token=session_token,
            userId=user_id,
            db=db,
        )

        set_session_token_cookie(
            response=response,
            token=session_token,
            expires_at=datetime.utcnow() + timedelta(days=30),
        )

        return RedirectResponse(url="/")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")
