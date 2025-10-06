# app/services/auth_service.py
from __future__ import annotations
import hashlib
import secrets
import uuid
from uuid import UUID
from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
    JWT_ISSUER,
    JWT_AUDIENCE,
    INACTIVITY_TIMEOUT_MINUTES,
)
from app.models.token import RefreshToken
from app.models import User, Wallet, ArtisanProfile, RefreshToken
from app.models.enums import UserRole, VerificationStatus
from app.models.session import Session as UserSession

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# password helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# time / ids
def _now() -> datetime:
    return datetime.now(timezone.utc)


def _generate_jti() -> str:
    return str(uuid.uuid4())


# sessions
def create_session(db: Session, user: User, ip: str | None = None, ua: str | None = None) -> UserSession:
    sess = UserSession(user_id=user.id, ip=ip, user_agent=ua)
    db.add(sess)
    db.commit()
    db.refresh(sess)
    return sess


def revoke_session(db: Session, sid: uuid.UUID) -> None:
    sess = db.get(UserSession, sid)
    if sess and not sess.revoked_at:
        sess.revoked_at = _now()
        db.add(sess)
        db.commit()


def revoke_all_sessions_for_user(db: Session, user_id: UUID) -> None:
    db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.revoked_at.is_(None)
    ).update({UserSession.revoked_at: _now()}, synchronize_session=False)
    db.commit()


def _get_or_create_active_session(db: Session, user: User) -> UserSession:
    """
    Prefer the most-recent non-revoked session; otherwise create a new one.
    This keeps refresh flows tied to an active session so inactivity is enforced.
    """
    sess = (
        db.query(UserSession)
        .filter(UserSession.user_id == user.id, UserSession.revoked_at.is_(None))
        .order_by(desc(UserSession.last_seen_at))
        .first()
    )
    if sess:
        return sess
    # create fresh session (no IP/UA here; it’s a refresh)
    return create_session(db, user, None, None)


# jwt helpers 
def create_access_token(user: User, sid: str) -> str:
    """
    Access JWT with iss/aud, 30m expiry by default (config).
    Carries 'sid' to bind the token to a server-side session.
    """
    jti = _generate_jti()
    iat = int(_now().timestamp())
    exp = int((_now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp())
    payload = {
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "sub": str(user.id),
        "role": user.role.value if hasattr(user.role, "value") else str(user.role),
        "sid": sid,            # <--- session id
        "jti": jti,
        "iat": iat,
        "exp": exp,
        "typ": "access",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Verify signature, expiry, issuer and audience.
    """
    try:
        data = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            audience=JWT_AUDIENCE,
            issuer=JWT_ISSUER,
            options={"require": ["exp", "iss", "aud", "sub"]},
        )
        if data.get("typ") != "access":
            raise JWTError("wrong token type")
        return data
    except JWTError as e:
        raise ValueError("Invalid or expired access token") from e


# refresh tokens (opaque, stored server-side) 
def create_refresh_token(db: Session, user: User) -> str:
    """
    Opaque refresh token: random 64-byte URL-safe string; store SHA-256 hash server-side.
    """
    token = secrets.token_urlsafe(64)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    jti = _generate_jti()
    expires_at = _now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    db.add(
        RefreshToken(
            user_id=user.id,
            jti=jti,
            token_hash=token_hash,
            expires_at=expires_at,
            revoked=False,
        )
    )
    db.commit()
    return token


# auth core 
def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    if not getattr(user, "is_active", True) or getattr(user, "is_blocked", False):
        return None
    return user


def issue_token_pair(db: Session, user: User, *, ip: str | None = None, ua: str | None = None) -> Tuple[str, str]:
    """
    Create a session, then issue (access-with-sid, refresh).
    """
    sess = create_session(db, user, ip=ip, ua=ua)
    access = create_access_token(user, sid=str(sess.id))
    refresh = create_refresh_token(db, user)
    return access, refresh


def rotate_refresh_token(db: Session, refresh_token: str) -> Tuple[User, str, str]:
    """
    Revoke old refresh, pick (or create) an active session for user, and issue new pair.
    This ensures refreshed access tokens are still bound to a live session and will
    be rejected if the user logs out (we revoke sessions in /logout).
    """
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    rec = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,  # noqa
            RefreshToken.expires_at > _now(),
        )
        .first()
    )

    if not rec:
        raise ValueError("Invalid or expired refresh token")

    user = db.query(User).get(rec.user_id)
    if not user or not getattr(user, "is_active", True) or getattr(user, "is_blocked", False):
        raise ValueError("User not allowed")

    # revoke old token and issue a new one (rotation)
    rec.revoked = True
    db.add(rec)
    db.commit()

    # re-use or create active session
    sess = _get_or_create_active_session(db, user)

    access = create_access_token(user, sid=str(sess.id))
    new_refresh = create_refresh_token(db, user)
    return user, access, new_refresh


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
    rec = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash, RefreshToken.revoked == False)  # noqa
        .first()
    )
    if rec:
        rec.revoked = True
        db.add(rec)
        db.commit()


# Revoke (delete) all refresh tokens for a user – used after password reset
def revoke_all_refresh_tokens_for_user(db: Session, user_id: UUID) -> None:
    """
    Hard-delete all active refresh tokens for this user.
    This guarantees no previously issued refresh token will survive a password reset.
    """
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete(synchronize_session=False)
    db.commit()


# signup helpers 
def create_customer(
    db: Session,
    *,
    full_name: str,
    email: str,
    phone: str | None,
    password: str,
    nin: str | None,
) -> User:
    # uniqueness checks
    if db.query(User).filter(User.email == email).first():
        raise ValueError("Email already exists")
    if phone and db.query(User).filter(User.phone_number == phone).first():
        raise ValueError("Phone already exists")

    user = User(
        full_name=full_name,
        email=email,
        phone_number=phone,
        password_hash=hash_password(password),
        nin=nin,
        role=UserRole.customer,
        is_active=True,
    )
    db.add(user)
    db.flush()
    db.add(Wallet(user_id=user.id, balance_kobo=0))
    db.commit()
    db.refresh(user)
    return user


def create_artisan(
    db: Session,
    *,
    full_name: str,
    email: str,
    phone: str | None,
    password: str,
    nin: str | None,
    category: str,
    description: str | None,
    years: int,
) -> User:
    if db.query(User).filter(User.email == email).first():
        raise ValueError("Email already exists")
    if phone and db.query(User).filter(User.phone_number == phone).first():
        raise ValueError("Phone already exists")

    user = User(
        full_name=full_name,
        email=email,
        phone_number=phone,
        password_hash=hash_password(password),
        nin=nin,
        role=UserRole.artisan,
        is_active=True,
    )
    db.add(user)
    db.flush()
    db.add(Wallet(user_id=user.id, balance_kobo=0))
    db.add(
        ArtisanProfile(
            user_id=user.id,
            service_category=category,
            service_description=description,
            years_of_experience=years,
            verification_status=VerificationStatus.pending,
        )
    )
    db.commit()
    db.refresh(user)
    return user
