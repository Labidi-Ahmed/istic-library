import secrets
import hashlib
import os
from datetime import datetime, timedelta
from typing import Optional, TypedDict
from fastapi import Response, Depends
from sqlalchemy.orm import Session
from models import User, Session as UserSession
from db import get_db


class SessionResult(TypedDict):
    session: Optional[UserSession]
    user: Optional[User]


def generate_session_token() -> str:

    # Generate 20 random bytes converted to base32 lowercase
    random_bytes = secrets.token_bytes(20)
    import base64

    token = base64.b32encode(random_bytes).decode("ascii").lower().rstrip("=")
    return token


async def create_session(
    # The session ID will be SHA-256 hash of the token
    token: str,
    userId: str,
    db: Session = Depends(get_db),
) -> UserSession:
    session_id = hashlib.sha256(token.encode()).hexdigest()
    expiresAt = datetime.now() + timedelta(days=30)

    session = UserSession(id=session_id, userId=userId, expiresAt=expiresAt)

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


async def validate_user(token: str, db: Session = Depends(get_db)) -> Optional[User]:
    """Validates the token and returns the user if valid"""
    validation_result = await validate_session_token(token, db)
    return validation_result.get("user")


async def validate_session_token(
    token: str, db: Session = Depends(get_db)
) -> SessionResult:
    if not token:
        return {"session": None, "user": None}

    # find the session id by encoding the token
    session_id = hashlib.sha256(token.encode()).hexdigest()
    session = db.query(UserSession).filter(UserSession.id == session_id).first()

    if session is None:
        return {"session": None, "user": None}

    user = db.query(User).filter(User.id == session.user_id).first()

    if user is None:
        return {"session": None, "user": None}

    # Check if session expired
    if datetime.now() >= session.expires_at:
        db.delete(session)
        db.commit()
        return {"session": None, "user": None}

    # Extend session if it's close to expiration (less than 15 days)
    if datetime.now() >= session.expires_at - timedelta(days=15):
        new_expires_at = datetime.now() + timedelta(days=30)
        session.expires_at = new_expires_at
        db.commit()
        db.refresh(session)

    return {"session": session, "user": user}


async def invalidate_session(session_id: str, db: Session = Depends(get_db)) -> None:
    session = db.query(UserSession).filter(UserSession.id == session_id).first()
    if session:
        db.delete(session)
        db.commit()


def set_session_token_cookie(
    response: Response, token: str, expires_at: datetime
) -> None:
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="lax",
        expires=expires_at.timestamp(),
        path="/",
        secure=os.getenv("ENV") == "PROD",
    )


def delete_session_token_cookie(response: Response) -> None:
    response.set_cookie(
        key="session",
        value="",
        httponly=True,
        samesite="lax",
        max_age=0,
        path="/",
        secure=os.getenv("ENV") == "PROD",
    )


auth_service = {
    "generate_session_token": generate_session_token,
    "create_session": create_session,
    "validate_user": validate_user,
    "validate_session_token": validate_session_token,
    "invalidate_session": invalidate_session,
    "set_session_token_cookie": set_session_token_cookie,
    "delete_session_token_cookie": delete_session_token_cookie,
}
