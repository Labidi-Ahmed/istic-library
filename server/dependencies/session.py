from fastapi import Depends, HTTPException, status, Request, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from routers.auth.auth_service import validate_user
from models import User
import os
from db import get_db
from sqlalchemy.orm import Session

security = HTTPBearer()


async def get_user(
    db: Session = Depends(get_db),
    session_token: str = Cookie(None, alias="sessionToken"),
) -> User:
    token = session_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    user = await validate_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    return user


async def get_protected_user(request: Request, user: User = Depends(get_user)) -> User:
    if request.method != "GET":
        origin = request.headers.get("origin")

        if not origin or origin != os.getenv("ORIGIN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden - Invalid origin",
            )
    return user
