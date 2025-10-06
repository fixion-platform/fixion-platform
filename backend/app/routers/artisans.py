# app/routers/artisans.py

from __future__ import annotations

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.auth_utils import get_current_user, require_artisan_approved, require_verified_contact
from app.utils import decrypt_str
from app.models import User, ArtisanProfile, ServiceCategory
from app.models.enums import VerificationStatus, UserRole
from app.schemas.artisan_schemas import (
    ArtisanMeOut, ArtisanUpdateIn, BankDetailsIn, ArtisanListOut
)

router = APIRouter(prefix="/artisans", tags=["Artisans"])

# ---------- helpers ----------
def _ensure_artisan(current: User):
    if current.role != UserRole.artisan:
        raise HTTPException(status_code=403, detail="Only artisans can access this endpoint")

def _profile_required(db: Session, user_id: uuid.UUID) -> ArtisanProfile:
    prof = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == user_id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Artisan profile not found")
    return prof

def _kobo_to_naira(kobo: Optional[int]) -> Optional[float]:
    if kobo is None:
        return None
    return round(kobo / 100.0, 2)

def _naira_to_kobo(naira: float | None) -> int | None:
    if naira is None:
        return None
    return int(round(naira * 100))

def _to_me_out(u: User, p: ArtisanProfile) -> ArtisanMeOut:
    return ArtisanMeOut(
        user_id=str(u.id),
        full_name=u.full_name,
        email=u.email,
        phone_number=decrypt_str(u.phone_number),
        role=str(u.role),
        service_category=p.service_category,
        service_description=p.service_description,
        years_of_experience=p.years_of_experience or 0,
        work_hours=p.work_hours,
        service_location=p.service_location,
        bank_name=p.bank_name,
        account_number=p.account_number,
        account_name=p.account_name,
        base_price_naira=_kobo_to_naira(getattr(p, "base_price_kobo", None)),  # <-- fixed
        verification_status=str(p.verification_status),
        rejection_reason=p.rejection_reason,
    )

# ---------- artisan self ----------
@router.get("/me", response_model=ArtisanMeOut)
def artisan_me(db: Session = Depends(get_db), current: User = Depends(require_verified_contact)):
    _ensure_artisan(current)
    prof = _profile_required(db, current.id)
    return _to_me_out(current, prof)

@router.patch("/me", response_model=ArtisanMeOut)
def update_artisan(
    payload: ArtisanUpdateIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_verified_contact),
):
    _ensure_artisan(current)
    prof = _profile_required(db, current.id)

    if payload.service_category is not None:
        prof.service_category = payload.service_category
    if payload.service_description is not None:
        prof.service_description = payload.service_description
    if payload.years_of_experience is not None:
        prof.years_of_experience = payload.years_of_experience
    if payload.work_hours is not None:
        prof.work_hours = payload.work_hours
    if payload.service_location is not None:
        prof.service_location = payload.service_location
    if getattr(payload, "base_price_naira", None) is not None:
        prof.base_price_kobo = _naira_to_kobo(payload.base_price_naira)

    db.add(prof)
    db.commit()
    db.refresh(prof)
    return _to_me_out(current, prof)

# NOTE: /artisans/me/bank was removed intentionally
# Alias route kept per userflow naming
@router.put("/set-bank-details", response_model=ArtisanMeOut)
def set_bank_details_alias(
    payload: BankDetailsIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_verified_contact),
):
    _ensure_artisan(current)
    prof = _profile_required(db, current.id)
    prof.bank_name = payload.bank_name
    prof.account_number = payload.account_number
    prof.account_name = payload.account_name
    db.add(prof)
    db.commit()
    db.refresh(prof)
    return _to_me_out(current, prof)

# ---------- availability (optional fields only if present on your model) ----------
class AvailabilityIn(BaseModel):
    days: List[str] = Field(..., description="e.g. ['mon','tue','wed']")
    start_time: str = Field(..., description="HH:MM 24h")
    end_time: str = Field(..., description="HH:MM 24h")
    radius_km: Optional[float] = Field(default=10.0)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

@router.put("/set-availability")
def set_availability(
    payload: AvailabilityIn,
    db: Session = Depends(get_db),
    current: User = Depends(require_artisan_approved),
):
    _ensure_artisan(current)
    prof = _profile_required(db, current.id)

    if hasattr(ArtisanProfile, "availability_days"):
        prof.availability_days = payload.days
    if hasattr(ArtisanProfile, "availability_start"):
        prof.availability_start = payload.start_time
    if hasattr(ArtisanProfile, "availability_end"):
        prof.availability_end = payload.end_time
    if hasattr(ArtisanProfile, "service_radius_km"):
        prof.service_radius_km = payload.radius_km
    if hasattr(ArtisanProfile, "latitude"):
        prof.latitude = payload.latitude
    if hasattr(ArtisanProfile, "longitude"):
        prof.longitude = payload.longitude

    db.add(prof)
    db.commit()
    return {"message": "Availability updated"}

# ---------- public/search ----------
@router.get("", response_model=List[ArtisanListOut])
def list_artisans(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    status: Optional[VerificationStatus] = Query(None),
    q: Optional[str] = Query(None, description="Search by name or email"),
    min_price: Optional[float] = Query(None, ge=0, description="Min price (naira)"),
    max_price: Optional[float] = Query(None, ge=0, description="Max price (naira)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    query = db.query(User).options(joinedload(User.artisan_profile)).filter(User.role == UserRole.artisan)

    if q:
        like = f"%{q}%"
        query = query.filter(or_(User.full_name.ilike(like), User.email.ilike(like)))

    query = query.join(ArtisanProfile, ArtisanProfile.user_id == User.id)

    if category:
        query = query.filter(ArtisanProfile.service_category == category)

    if status:
        query = query.filter(ArtisanProfile.verification_status == status)

    # price range (naira -> kobo)
    price_filters = []
    if min_price is not None:
        price_filters.append(ArtisanProfile.base_price_kobo >= _naira_to_kobo(min_price))
    if max_price is not None:
        price_filters.append(ArtisanProfile.base_price_kobo <= _naira_to_kobo(max_price))

    if price_filters:
        query = query.filter(and_(*price_filters))

    rows = query.order_by(User.created_at.desc()).limit(limit).offset(offset).all()

    out: List[ArtisanListOut] = []
    for u in rows:
        p = u.artisan_profile
        out.append(ArtisanListOut(
            user_id=str(u.id),
            full_name=u.full_name,
            email=u.email,
            phone_number=decrypt_str(u.phone_number),
            service_category=p.service_category if p else None,
            service_location=p.service_location if p else None,
            base_price_naira=_kobo_to_naira(getattr(p, "base_price_kobo", None)) if p else None,
            verification_status=str(p.verification_status) if p else str(VerificationStatus.pending),
        ))
    return out

@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(ServiceCategory)
        .filter(ServiceCategory.is_active == True)  # noqa
        .order_by(ServiceCategory.name.asc())
        .all()
    )
    return [r.name for r in rows]

@router.get("/{artisan_user_id}", response_model=ArtisanMeOut)
def get_artisan_public(artisan_user_id: str, db: Session = Depends(get_db)):
    try:
        uid = uuid.UUID(artisan_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user id")
    u = db.query(User).filter(User.id == uid, User.role == UserRole.artisan).first()
    if not u:
        raise HTTPException(status_code=404, detail="Artisan not found")
    p = _profile_required(db, u.id)
    return _to_me_out(u, p)
