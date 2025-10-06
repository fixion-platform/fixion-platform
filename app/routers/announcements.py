"""
Public announcement endpoints.

These routes expose system-wide announcements created by admins. Clients
can retrieve active announcements with pagination. Admins manage
announcements via the admin API; these routes are read-only for end
users.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from typing import Optional

from app.db.database import get_db
from app.models.announcement import Announcement
from app.schemas.announcement_schemas import AnnouncementOut, AnnouncementListOut

router = APIRouter(prefix="/announcements", tags=["Announcements"])


@router.get("", response_model=AnnouncementListOut)
def list_announcements(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    only_active: bool = Query(True, description="Return only active announcements"),
):
    """
    Return a paginated list of announcements. By default only active
    announcements are returned. Clients can adjust the limit and offset
    for pagination. Announcements are ordered from newest to oldest.
    """
    q = db.query(Announcement).order_by(Announcement.created_at.desc())
    if only_active:
        q = q.filter(Announcement.is_active == True)  # noqa: E712
    total = q.count()
    rows = q.offset(offset).limit(limit).all()
    items = [
        AnnouncementOut(
            id=str(a.id),
            title=a.title,
            message=a.message,
            created_at=a.created_at,
        )
        for a in rows
    ]
    return AnnouncementListOut(total=total, items=items)