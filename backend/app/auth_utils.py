# app/auth_utils.py
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import User
from app.models.artisan import ArtisanProfile
from app.models.enums import UserRole, VerificationStatus
from app.models.session import Session as UserSession
from app.services.auth_service import decode_access_token
from app.config import INACTIVITY_TIMEOUT_MINUTES

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def _unauth(msg="Not authenticated"):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=msg)

def get_current_user_with_session(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> tuple[User, UserSession]:
    try:
        payload = decode_access_token(token)
    except ValueError:
        _unauth("Invalid token")

    user_id = payload.get("sub")
    sid = payload.get("sid")
    if not user_id or not sid:
        _unauth("Invalid token payload")

    user = db.get(User, user_id)
    if not user:
        _unauth("User not found")
    if not user.is_active or getattr(user, "is_blocked", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User inactive or blocked")

    sess = db.get(UserSession, uuid.UUID(str(sid)))
    if not sess or sess.user_id != user.id:
        _unauth("Session not found")

    # revoked?
    if sess.revoked_at is not None:
        _unauth("Session revoked. Please login again.")

    # inactivity check (sliding)
    now = datetime.now(timezone.utc)
    last = sess.last_seen_at or sess.created_at
    idle_minutes = (now - last).total_seconds() / 60.0
    if idle_minutes > INACTIVITY_TIMEOUT_MINUTES:
        sess.revoked_at = now
        db.add(sess); db.commit()
        _unauth("Session expired due to inactivity. Please login again.")

    # sliding update
    sess.last_seen_at = now
    db.add(sess); db.commit()

    return user, sess

# Dependency to get the current user
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    user, _ = get_current_user_with_session(token, db)
    return user

# Dependency to get the current session
def require_admin(current: User = Depends(get_current_user)) -> User:
    if current.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current

# Simple role checker (case insensitive)
def require_role(user, role_name: str):
    val = str(getattr(user, "role", "")).split(".")[-1].lower()
    if val != role_name.lower():
        raise HTTPException(status_code=403, detail=f"{role_name.capitalize()} only")

# Contact verification checker
def require_verified_contact(current: User = Depends(get_current_user)) -> User:
    """
    Allow only users with a verified contact (email or phone).
    """
    email_ok = bool(getattr(current, "email_verified", False))
    phone_ok = bool(getattr(current, "phone_verified", False))
    if not (email_ok or phone_ok):
        raise HTTPException(status_code=403, detail="Verify your email or phone to continue")
    return current


# Robust approval checker (works with Enum or text)
def _is_status_approved(status_obj) -> bool:
    """
    Normalize enum/text to lowercase token and match common 'approved' variants.
    Adjust the set below if your project uses a different label.
    """
    if status_obj is None:
        return False
    if hasattr(status_obj, "name"):
        token = status_obj.name
    else:
        s = str(status_obj)
        token = s.split(".")[-1] if "." in s else s
    return token.strip().lower() in {"approved", "verified"}  # add more if needed

# Artisan approval checker
def require_artisan_approved(
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    # Must be an artisan
    if current.role != UserRole.artisan:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only artisans allowed")

    ap = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == current.id).first()
    if not ap or not _is_status_approved(ap.verification_status):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your artisan account is pending admin approval"
        )
    return current
