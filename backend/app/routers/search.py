# app/routers/search.py
from __future__ import annotations
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, and_
from sqlalchemy import func, cast, String
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models import User
from app.models.artisan import ArtisanProfile
from app.models.enums import UserRole, VerificationStatus
from app.schemas.artisan_schemas import ArtisanListOut
from app.utils import decrypt_str

router = APIRouter(prefix="/search", tags=["Search"])


def _kobo_to_naira(kobo: int | None) -> float | None:
    if kobo is None:
        return None
    return round(kobo / 100.0, 2)


@router.get(
    "/artisans",
    response_model=List[ArtisanListOut],
    summary="Search Artisans",
    description=(
        "Search artisans by free-text (name/email), category, location, verification status, "
        "and price range. Prices are specified in **naira**; they are stored in kobo internally."
    ),
)
def search_artisans(
    db: Session = Depends(get_db),
    location: Optional[str] = Query(
        None,
        description="Substring match on the artisan's service_location (e.g. 'Yaba', 'Ikeja').",
        examples=["Yaba", "Lagos"],
    ),
    category: Optional[str] = Query(
        None,
        description="Exact service category name (see /artisans/categories).",
        examples=["plumbing", "electrical"],
    ),
    q: Optional[str] = Query(
        None,
        description="Free-text search over full name and email.",
        examples=["Ade", "artisan@example.com"],
    ),
    status: Optional[VerificationStatus] = Query(
        None,
        description="Filter by artisan verification status.",
    ),
    min_price: Optional[float] = Query(
        None,
        ge=0,
        description="Minimum displayed price in **naira** (inclusive).",
        examples=[2_000.0, 5_000.0],
    ),
    max_price: Optional[float] = Query(
        None,
        ge=0,
        description="Maximum displayed price in **naira** (inclusive).",
        examples=[20_000.0, 10_000.0],
    ),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Notes on price filtering:
    - `min_price` / `max_price` are **naira**, converted to kobo for DB filtering.
    - If an artisan hasn't set a price yet (`base_price_kobo` is NULL), they won't match
      a price filter (only returned when no `min_price`/`max_price` are provided).
    - By default, only **approved** artisans are returned.
    """
    query = (
        db.query(User)
        .options(joinedload(User.artisan_profile))
        .filter(User.role == UserRole.artisan)
        .join(ArtisanProfile, ArtisanProfile.user_id == User.id)
    )

    # Default: show only approved artisans unless an explicit status filter is supplied
    if status is None:
        query = query.filter(
            func.lower(cast(ArtisanProfile.verification_status, String)).in_(
                ["approved", "verified"]
            )
        )
    else:
        # Robust to DB enum/text storage
        query = query.filter(
            func.lower(cast(ArtisanProfile.verification_status, String))
            == status.name.lower()
        )

    if q:
        like = f"%{q}%"
        query = query.filter(or_(User.full_name.ilike(like), User.email.ilike(like)))

    if category:
        query = query.filter(ArtisanProfile.service_category == category)

    if location:
        like_loc = f"%{location}%"
        query = query.filter(ArtisanProfile.service_location.ilike(like_loc))

    # price range in NAIRA - KOBO filtering
    price_filters = []
    if min_price is not None:
        min_kobo = int(round(min_price * 100))
        price_filters.append(ArtisanProfile.base_price_kobo >= min_kobo)
    if max_price is not None:
        max_kobo = int(round(max_price * 100))
        price_filters.append(ArtisanProfile.base_price_kobo <= max_kobo)
    if price_filters:
        query = query.filter(and_(*price_filters))

    rows = query.order_by(User.created_at.desc()).limit(limit).offset(offset).all()

    out: List[ArtisanListOut] = []
    for u in rows:
        p = u.artisan_profile
        out.append(
            ArtisanListOut(
                user_id=str(u.id),
                full_name=u.full_name,
                email=u.email,
                phone_number=decrypt_str(u.phone_number) if u.phone_number else None,
                service_category=p.service_category if p else None,
                service_location=p.service_location if p else None,
                base_price_naira=_kobo_to_naira(getattr(p, "base_price_kobo", None)) if p else None,
                verification_status=str(p.verification_status) if p else str(VerificationStatus.pending),
            )
        )
    return out
