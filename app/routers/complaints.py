# app/routers/complaints.py

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, UUID4, Field
from typing import Optional, List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.complaint import Complaint
from app.models.user import User
from app.auth_utils import get_current_user
from app.security.sanitize import clean_free_text

router = APIRouter(prefix="/complaints", tags=["Complaints"])

class ComplaintCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    description: str = Field(..., min_length=5, max_length=2000)
    job_id: Optional[UUID4] = None

class ComplaintOut(BaseModel):
    id: UUID4
    title: str
    description: str
    status: str

    class Config:
        from_attributes = True

@router.post("", response_model=ComplaintOut, status_code=201)
def create_complaint(payload: ComplaintCreate, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    # Sanitize and validate the free-text fields to remove any potentially harmful
    # content and enforce length constraints.  Titles must remain at least 3 characters
    # after sanitization and descriptions at least 5 characters.
    title = clean_free_text(payload.title, 120)
    description = clean_free_text(payload.description, 2000)
    if len(title) < 3:
        raise HTTPException(status_code=400, detail="Title is too short after sanitization")
    if len(description) < 5:
        raise HTTPException(status_code=400, detail="Description is too short after sanitization")

    c = Complaint(
        raised_by_id=current.id,
        job_id=payload.job_id,
        title=title,
        description=description,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.get("/my", response_model=List[ComplaintOut])
def list_my_complaints(
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    return (
        db.query(Complaint)
        .filter(Complaint.raised_by_id == current.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
