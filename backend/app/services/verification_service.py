# app/services/verification_service.py
from __future__ import annotations
import hashlib
import secrets
from datetime import timedelta

from sqlalchemy.orm import Session

from app.services.sms_service import send_phone_code, check_phone_code
from app.models import User, EmailPhoneToken
from app.models.enums import TokenPurpose
from app.services.auth_service import _now
from app.services.email_service import send_email 
from app.config import ENV

OTP_LENGTH = 6


def _hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def _random_otp() -> str:
    # 6-digit numeric OTP, left-padded
    n = secrets.randbelow(10**OTP_LENGTH)
    return f"{n:0{OTP_LENGTH}d}"

def _issue_token(db: Session, user: User, purpose: TokenPurpose, target: str, ttl_minutes: int) -> str:
    if purpose in [TokenPurpose.email_verify, TokenPurpose.phone_verify]:
        token = _random_otp()   # always 6-digit OTP
    else:
        token = _random_otp()  # fallback for other cases

    token_hash = _hash(token)
    expires_at = _now() + timedelta(minutes=ttl_minutes)

    # revoke previous active tokens
    db.query(EmailPhoneToken).filter(
        EmailPhoneToken.user_id == user.id,
        EmailPhoneToken.purpose == purpose,
        EmailPhoneToken.target == target,
    ).delete(synchronize_session=False)    

    # Insert fresh row
    rec = EmailPhoneToken(
        user_id=user.id,
        purpose=purpose,
        token_hash=token_hash,
        target=target,
        expires_at=expires_at,
        used=False,
    )
    db.add(rec)
    db.commit()
    return token


def _consume_token(db: Session, user: User, purpose: TokenPurpose, target: str, token: str) -> None:
    token_hash = _hash(token)
    row = db.query(EmailPhoneToken).filter(
        EmailPhoneToken.user_id == user.id,
        EmailPhoneToken.purpose == purpose,
        EmailPhoneToken.target == target,
        EmailPhoneToken.used == False,  # noqa
        EmailPhoneToken.expires_at > _now(),
        EmailPhoneToken.token_hash == token_hash
    ).first()
    if not row:
        raise ValueError("Invalid or expired token")
    row.used = True
    db.add(row)
    db.commit()


# public helpers used by routers 

def issue_email_verification(db: Session, user: User) -> str:
    """Creates an email verification token and SENDS it via Gmail SMTP."""
    token = _issue_token(db, user, TokenPurpose.email_verify, target=user.email, ttl_minutes=30)

    subject = "Verify your email for Fixion"
    html = f"""
    <div style="font-family:Arial, sans-serif; max-width:560px; margin:0 auto;">
      <h2>Fixion Email Verification</h2>
      <p>Hi {user.full_name or "there"},</p>
      <p>Use the token below to verify your email address. It expires in <b>30 minutes</b>.</p>
      <div style="font-size:22px; letter-spacing:3px; padding:12px 16px; background:#f2f4f7; display:inline-block; border-radius:8px;">
        {token}
      </div>
      <p style="margin-top:16px;">Open the app and submit this token on the verification screen.</p>
      <p style="color:#667085; font-size:12px;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
    """
    text = f"Your Fixion email verification token is: {token}\nThis token expires in 30 minutes."

    # Send, if it fails, raise to surface the issue (so you fix SMTP early)
    send_email(user.email, subject, html, text)

    return token  # Keep returning for dev/testing responses if you want to show it

def confirm_email_verification(db: Session, user: User, token: str) -> None:
    _consume_token(db, user, TokenPurpose.email_verify, user.email, token)
    user.email_verified = True
    db.add(user)
    db.commit()

def issue_phone_verification(db: Session, user: User, phone: str) -> str:
    """
    Sends a 6-digit code via Twilio Verify SMS to the target phone.
    We no longer insert an OTP row in email_phone_tokens for phone.
    Returns an empty string (do not expose OTP).
    """
    if not phone:
        raise ValueError("Phone number required")

    try:
        # Fire SMS via Twilio Verify
        send_phone_code(phone)
    except Exception as e:
        raise ValueError(str(e))

    # For production, DO NOT return the OTP
    return ""  # keeps your router response shape: {"message": "OTP sent", "otp_for_testing": ""}

def confirm_phone_verification(db: Session, user: User, phone: str, otp: str) -> None:
    """
    Verifies the 6-digit code with Twilio Verify.
    On success: set (user.phone_number, user.phone_verified) and commit.
    """
    if not phone or not otp:
        raise ValueError("Phone and OTP are required")

    try:
        ok = check_phone_code(phone, otp)
    except Exception as e:
        raise ValueError(str(e))

    if not ok:
        raise ValueError("Invalid or expired OTP")

    # success — persist on the user
    if not user.phone_number:
        user.phone_number = phone
    user.phone_verified = True
    db.add(user)
    db.commit()
