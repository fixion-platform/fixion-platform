"""
Dispute routes for users.

Customers and artisans can raise disputes against a job if they
encounter issues that complaints alone cannot resolve. A dispute
captures the job, the party opening the dispute, a reason, and an
initial status of "open". Users can also list the disputes they have
opened. Admins handle listing and resolution via the admin API.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, UUID4
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import Dispute, Job, User
from app.auth_utils import get_current_user
from app.security.sanitize import clean_free_text

router = APIRouter(prefix="/disputes", tags=["Disputes"])


class DisputeCreate(BaseModel):
    job_id: UUID4 = Field(..., description="Job identifier being disputed")
    reason: str = Field(..., min_length=5, max_length=600)


class DisputeOut(BaseModel):
    id: UUID4
    job_id: Optional[UUID4]
    reason: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("", response_model=DisputeOut, status_code=201)
def create_dispute(
    payload: DisputeCreate,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """
    Open a new dispute. The current user must be either the customer or
    artisan on the specified job. A sanitized reason is stored.
    """
    job = db.query(Job).filter(Job.id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    # Ensure user is participant
    if str(job.customer_id) != str(current.id) and str(job.artisan_id) != str(current.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to open a dispute on this job")
    reason = clean_free_text(payload.reason, 600)
    if not reason:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reason cannot be empty")
    dispute = Dispute(job_id=job.id, opened_by_id=current.id, reason=reason)
    db.add(dispute)
    db.commit()
    db.refresh(dispute)
    return dispute


@router.get("/my", response_model=List[DisputeOut])
def list_my_disputes(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    """
    List disputes opened by the current user, most recent first.
    """
    rows = (
        db.query(Dispute)
        .filter(Dispute.opened_by_id == current.id)
        .order_by(Dispute.created_at.desc())
        .all()
    )
    return rows