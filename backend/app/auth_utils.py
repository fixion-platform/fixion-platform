# auth_utils.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.schemas.user_schemas import UserResponse
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.database import get_user
import os

# OAuth2 setup - this tells FastAPI where to find the token login route
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_active_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    """Get the currently logged-in user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    email = decode_access_token(token)
    if not email:
        raise credentials_exception

    user = get_user(email=email)
    if not user:
        raise credentials_exception

    return UserResponse(**user)


def ensure_admin(current_user: UserResponse = Depends(get_current_active_user)):
    """Only allow access to admins."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins are allowed to access this resource."
        )
    return current_user
