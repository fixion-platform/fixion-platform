from __future__ import annotations

from app.config import IS_PRODUCTION
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth_utils import get_current_user
from app.utils import encrypt_str, decrypt_str
from app.models import User
from app.schemas.user_schemas import UserOut, UpdateProfileIn, PreferencesIn
from app.schemas.auth_schemas import VerifyEmailOut, VerifyEmailConfirmIn
from app.services.verification_service import issue_email_verification, confirm_email_verification

# sanitizers
from app.security.sanitize import clean_name, clean_phone, clean_free_text

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_me(current: User = Depends(get_current_user)):
    u = current
    return {
        "id": str(u.id),
        "full_name": u.full_name,
        "email": u.email,
        "phone_number": decrypt_str(u.phone_number),
        "role": str(u.role),
        "location": u.location,
        "service_preferences": u.service_preferences or {},
        "email_verified": u.email_verified,
        "phone_verified": u.phone_verified,
        "is_active": u.is_active,
        "is_blocked": u.is_blocked,
    }

@router.patch("/update-profile", response_model=UserOut)
def update_profile(
    payload: UpdateProfileIn,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user)
):
    """
    Update user's profile (full name, phone number, location).
    This version ensures the full_name actually updates even if case/spacing differs.
    """
    # Update full name
    if payload.full_name is not None:
        new_name = clean_name(payload.full_name, 80)
        # Only update if name changed (case-insensitive comparison)
        if new_name.strip().lower() != (current.full_name or "").strip().lower():
            current.full_name = new_name

    # Update phone number
    if payload.phone_number is not None:
        new_phone = clean_phone((payload.phone_number or "").strip(), 32)

        if new_phone:
            # Ensure no duplicate phone across users
            others = (
                db.query(User.id, User.phone_number)
                .filter(User.id != current.id)
                .all()
            )
            for uid, enc_phone in others:
                if decrypt_str(enc_phone) == new_phone:
                    raise HTTPException(status_code=400, detail="Phone number already in use")

            current.phone_number = encrypt_str(new_phone)
        else:
            current.phone_number = None

    # Update location
    if payload.location is not None:
        current.location = clean_free_text(payload.location, 120)

    # Save all updates
    db.add(current)
    db.commit()
    db.refresh(current)

    # Always return fresh DB data (reflects updated name immediately)
    return {
        "id": str(current.id),
        "full_name": current.full_name,
        "email": current.email,
        "phone_number": decrypt_str(current.phone_number),
        "role": str(current.role),
        "location": current.location,
        "service_preferences": current.service_preferences or {},
        "email_verified": current.email_verified,
        "phone_verified": current.phone_verified,
        "is_active": current.is_active,
        "is_blocked": current.is_blocked,
    }

@router.put("/preferences", response_model=UserOut)
def set_preferences(payload: PreferencesIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    current.service_preferences = payload.service_preferences or {}
    db.add(current)
    db.commit()
    db.refresh(current)
    return {
        "id": str(current.id),
        "full_name": current.full_name,
        "email": current.email,
        "phone_number": decrypt_str(current.phone_number),
        "role": str(current.role),
        "location": current.location,
        "service_preferences": current.service_preferences or {},
        "email_verified": current.email_verified,
        "phone_verified": current.phone_verified,
        "is_active": current.is_active,
        "is_blocked": current.is_blocked,
    }

@router.post("/verify-email", response_model=VerifyEmailOut)
def send_email_verification(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.email_verified:
        return {"message": "Email already verified", "token_for_testing": ""}
    token = issue_email_verification(db, current)
    return {"message": "Verification email sent", "token_for_testing": "" if IS_PRODUCTION else token}

@router.post("/verify-email/confirm", response_model=dict)
def confirm_email(payload: VerifyEmailConfirmIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    try:
        confirm_email_verification(db, current, payload.token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Email verified"}
