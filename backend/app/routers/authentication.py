# routers/authentication.py

from datetime import timedelta
import logging
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse

from schemas.auth_schemas import Token
import auth_utils
from database import get_user
from services.auth_service import get_password_hash
from services.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES
from utils import validate_strong_password

# --- Configure Logging ---
logging.basicConfig(
    filename="logs/auth.log",  # Ensure logs/ folder exists
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# In-memory reset token storage (for demo purposes)
reset_tokens = {}

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Provides a JWT token for valid user credentials.
    Logs all login attempts.
    """
    user = get_user(email=form_data.username)

    if not user or not auth_utils.verify_password(form_data.password, user["hashed_password"]):
        logging.info(f"FAILED LOGIN: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user["role"] == "artisan" and not user.get("verified", False):
        logging.info(f"LOGIN BLOCKED (UNVERIFIED ARTISAN): {user['email']}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending admin verification. Please wait for approval."
        )

    if user["role"] == "customer" and not user.get("email_verified", False):
        logging.info(f"LOGIN BLOCKED (EMAIL NOT VERIFIED): {user['email']}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    logging.info(f"SUCCESSFUL LOGIN: {user['email']}")

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """
    Placeholder logout endpoint.
    Instructs the frontend to delete the stored JWT token since we can't revoke JWTs server-side.
    """
    return JSONResponse(
        content={"message": "Logout successful. Please clear your token on the client side."}
    )


@router.post("/forgot-password")
def forgot_password(email: str):
    """
    Simulates sending a password reset token to user's email.
    Stores token in memory (mock).
    """
    user = get_user(email)
    if not user:
        logging.warning(f"FORGOT PASSWORD FAILED - USER NOT FOUND: {email}")
        raise HTTPException(status_code=404, detail="User not found")

    reset_token = str(uuid4())
    reset_tokens[reset_token] = email

    logging.info(f"RESET TOKEN CREATED for {email}: {reset_token}")

    return {
        "message": "Password reset token generated (mock).",
        "reset_token": reset_token
    }


@router.post("/reset-password")
def reset_password(token: str, new_password: str):
    """
    Resets the password using a valid reset token.
    """
    email = reset_tokens.get(token)
    if not email:
        logging.warning(f"RESET PASSWORD FAILED - INVALID TOKEN: {token}")
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    validate_strong_password(new_password)
    user["hashed_password"] = get_password_hash(new_password)
    
    del reset_tokens[token]  # Invalidate token
    logging.info(f"PASSWORD RESET SUCCESSFUL for {email}")
    return {"message": "Password reset successful"}
