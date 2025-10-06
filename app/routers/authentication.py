from __future__ import annotations

from app.config import IS_PRODUCTION

import hashlib
import secrets
from datetime import timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.enums import TokenPurpose
from app.models.token import EmailPhoneToken
from app.schemas.auth_schemas import (
    LoginOut, TokenPair, RefreshIn, LogoutIn, Message,
    VerifyPhoneIn, VerifyPhoneOut, VerifyPhoneConfirmIn
)
from app.schemas.user_schemas import SignupCustomerIn, SignupArtisanIn
from app.services.auth_service import (
    _now,
    authenticate_user,
    issue_token_pair,
    rotate_refresh_token,
    revoke_refresh_token,
    create_customer,
    create_artisan,
)
from app.security.rate_limit import login_rate_limit_and_form, clear_login_bucket
from app.services.email_service import send_email
from app.utils import get_password_hash, validate_strong_password, encrypt_str
from app.auth_utils import get_current_user, get_current_user_with_session
from app.models import User
from app.services.verification_service import issue_phone_verification, confirm_phone_verification

# NEW: sanitizers
from app.security.sanitize import clean_name, clean_email_lower, clean_phone, clean_free_text

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup-customer", response_model=Message, status_code=201)
def signup_customer(payload: SignupCustomerIn, db: Session = Depends(get_db)):
    try:
        # sanitize (schemas already do, but we double-check here)
        full_name = clean_name(payload.full_name, 80)
        email = clean_email_lower(str(payload.email))
        phone = clean_phone(payload.phone_number, 32) if payload.phone_number else None
        nin = clean_free_text(payload.nin, 20) if payload.nin else None

        validate_strong_password(payload.password)
        create_customer(
            db,
            full_name=full_name,
            email=email,
            phone=encrypt_str(phone) if phone else None,
            password=payload.password,
            nin=encrypt_str(nin) if nin else None,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Customer created. Please verify email/phone later."}

@router.post("/signup-artisan", response_model=Message, status_code=201)
def signup_artisan(payload: SignupArtisanIn, db: Session = Depends(get_db)):
    try:
        full_name = clean_name(payload.full_name, 80)
        email = clean_email_lower(str(payload.email))
        phone = clean_phone(payload.phone_number, 32) if payload.phone_number else None
        nin = clean_free_text(payload.nin, 20) if payload.nin else None

        validate_strong_password(payload.password)
        create_artisan(
            db,
            full_name=full_name,
            email=email,
            phone=encrypt_str(phone) if phone else None,
            password=payload.password,
            nin=encrypt_str(nin) if nin else None,
            category=payload.service_category,       # schemas cleaned
            description=payload.service_description, # schemas cleaned
            years=payload.years_of_experience,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Artisan created. Await admin verification."}

@router.post("/login", response_model=LoginOut)
async def login(
    form: OAuth2PasswordRequestForm = Depends(login_rate_limit_and_form),
    db: Session = Depends(get_db),
    request: Request = None,
):
    """
    OAuth2PasswordRequestForm expects `username` (treated as email) and `password`.
    Rate-limited to 5 attempts / 15 minutes per IP+username.
    The body is parsed ONCE inside the dependency to avoid 'Stream consumed'.
    """
    user = authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")

    if request is not None:
        await clear_login_bucket(request, form.username)

    ip = request.client.host if request and request.client else None
    ua = request.headers.get("User-Agent") if request else None

    access, refresh = issue_token_pair(db, user, ip=ip, ua=ua)
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}

@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshIn, db: Session = Depends(get_db)):
    try:
        _, access, new_refresh = rotate_refresh_token(db, payload.refresh_token)
        return {"access_token": access, "refresh_token": new_refresh, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout", response_model=Message)
def logout(
    payload: LogoutIn,
    db: Session = Depends(get_db),
    user_and_sess = Depends(get_current_user_with_session),
):
    revoke_refresh_token(db, payload.refresh_token)
    user, sess = user_and_sess
    from app.services.auth_service import revoke_session
    revoke_session(db, sess.id)
    return {"message": "Logged out"}

@router.post("/verify-phone", response_model=VerifyPhoneOut)
def send_phone_verification(payload: VerifyPhoneIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.phone_verified and current.phone_number == payload.phone_number:
        return {"message": "Phone already verified", "otp_for_testing": ""}
    try:
        otp = issue_phone_verification(db, current, payload.phone_number)
        return {"message": "OTP sent", "otp_for_testing": "" if IS_PRODUCTION else otp}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-phone/confirm", response_model=Message)
def confirm_phone(payload: VerifyPhoneConfirmIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    try:
        confirm_phone_verification(db, current, payload.phone_number, payload.otp)
        return {"message": "Phone verified"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Forgot / Reset Password (6-digit OTP) 

def _random_otp_6() -> str:
    n = secrets.randbelow(10**6)
    return f"{n:06d}"

def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

class ForgotPasswordIn(BaseModel):
    email: EmailStr

class ResetPasswordIn(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

@router.post("/forgot-password", response_model=Message)
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.is_active or getattr(user, "is_blocked", False):
        return {"message": "If that email exists, a reset code has been sent."}

    target = f"reset:{payload.email.strip().lower()}"

    db.query(EmailPhoneToken).filter(
        EmailPhoneToken.user_id == user.id,
        EmailPhoneToken.purpose == TokenPurpose.email_verify,
        EmailPhoneToken.target == target,
    ).delete(synchronize_session=False)
    db.commit()

    otp = _random_otp_6()
    token_hash = _sha256(otp)
    expires_at = _now() + timedelta(minutes=15)

    rec = EmailPhoneToken(
        user_id=user.id,
        purpose=TokenPurpose.email_verify,
        token_hash=token_hash,
        target=target,
        expires_at=expires_at,
        used=False,
    )
    db.add(rec)
    db.commit()

    subject = "Fixion Password Reset Code"
    html = f"""
    <div style="font-family:Arial, sans-serif; max-width:560px; margin:0 auto;">
      <h2>Fixion Password Reset</h2>
      <p>Hello {user.full_name or 'there'},</p>
      <p>Your password reset code is:</p>
      <div style="font-size:22px; letter-spacing:3px; padding:12px 16px; background:#f2f4f7; display:inline-block; border-radius:8px;">
        {otp}
      </div>
      <p style="margin-top:12px;">This code expires in <b>15 minutes</b>. If you didn't request it, you can ignore this email.</p>
      <p style="color:#667085; font-size:12px;">— Fixion Security</p>
    </div>
    """
    try:
        send_email(to_email=payload.email, subject=subject, html=html)
    except Exception as e:
        print("[email] Failed to send reset email:", e)

    return {"message": "If that email exists, a reset code has been sent."}

@router.post("/reset-password", response_model=Message)
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    try:
        validate_strong_password(payload.new_password)
    except HTTPException as he:
        raise he

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.is_active or getattr(user, "is_blocked", False):
        return {"message": "Password has been reset if the code was valid."}

    target = f"reset:{payload.email.strip().lower()}"
    token_hash = _sha256(payload.otp)

    row = db.query(EmailPhoneToken).filter(
        EmailPhoneToken.user_id == user.id,
        EmailPhoneToken.purpose == TokenPurpose.email_verify,
        EmailPhoneToken.target == target,
        EmailPhoneToken.used == False,
        EmailPhoneToken.expires_at > _now(),
        EmailPhoneToken.token_hash == token_hash,
    ).first()

    if not row:
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    row.used = True
    db.add(row)

    new_hash = get_password_hash(payload.new_password)
    if hasattr(user, "password_hash"):
        user.password_hash = new_hash
    elif hasattr(user, "hashed_password"):
        user.hashed_password = new_hash
    else:
        raise HTTPException(status_code=500, detail="User model has no password field")

    db.add(user)

    from app.services.auth_service import revoke_all_refresh_tokens_for_user, revoke_all_sessions_for_user
    revoke_all_refresh_tokens_for_user(db, user.id)
    revoke_all_sessions_for_user(db, user.id)

    db.commit()
    return {"message": "Password reset successful."}
