from fastapi import Depends, HTTPException, status, Request, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from server.app.routers.auth.auth_service import auth_service
from app.models import User
import os

security = HTTPBearer()


async def get_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session_token: str = Cookie(None, alias="session"),
) -> User:
    token = session_token or credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    user = await auth_service.validate_user(token)
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
