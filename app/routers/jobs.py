"""
Job booking and search routes for the Fixion platform.

This module defines endpoints that allow customers to search for artisans,
book jobs, track job status, and leave reviews. Artisans can fetch job
requests, respond to them, update their progress, and attach completion
photos or notes. Admins can also view and manage bookings through other
routers.
"""

from __future__ import annotations
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth_utils import get_current_user, require_verified_contact, require_artisan_approved, _is_status_approved
from app.security.rbac import require_job_access  # centralized guard
from app.models import User, Job, JobStatusHistory, JobNote, JobPhoto, Review
from app.models.enums import JobStatus, UserRole
from app.schemas.job_schemas import (
    BookJobIn, JobOut, JobListOut,
    JobRespondIn, JobStatusUpdateIn,
    JobNoteIn, JobNoteOut, ReviewIn, Message
)
from app.models.artisan import ArtisanProfile

# extra safety for notes
from app.security.sanitize import clean_free_text

router = APIRouter(prefix="/jobs", tags=["Jobs"])

# helpers
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "jobs")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def require_role(user: User, role: UserRole):
    if user.role != role:
        raise HTTPException(status_code=403, detail=f"{role.value.capitalize()} only")

def to_out(j: Job) -> JobOut:
    return JobOut(
        id=str(j.id),
        job_number=j.job_number,
        customer_id=str(j.customer_id) if j.customer_id else None,
        artisan_id=str(j.artisan_id) if j.artisan_id else None,
        service_category=j.service_category,
        location=j.location,
        description=j.description,
        status=str(j.status),
        scheduled_at=j.scheduled_at,
        created_at=j.created_at,
    )

def add_status_history(db: Session, job: Job, old, new, by: User):
    db.add(JobStatusHistory(job_id=job.id, old_status=old, new_status=new, changed_by_id=by.id))

ALLOWED_TRANSITIONS = {
    JobStatus.pending:     {JobStatus.accepted, JobStatus.cancelled},
    JobStatus.accepted:    {JobStatus.on_the_way, JobStatus.cancelled},
    JobStatus.on_the_way:  {JobStatus.working, JobStatus.cancelled},
    JobStatus.working:     {JobStatus.completed, JobStatus.cancelled},
}

def ensure_transition(old: JobStatus, new: JobStatus):
    if new == old:
        return
    allowed = ALLOWED_TRANSITIONS.get(old, set())
    if new not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid status transition: {old} -> {new}")

# customer: book & my bookings
@router.post("/book", response_model=JobOut, status_code=201)
def book_job(payload: BookJobIn, db: Session = Depends(get_db), current: User = Depends(require_verified_contact)):
    require_role(current, UserRole.customer)

    artisan_id = None
    if payload.artisan_user_id:
        try:
            artisan_id = uuid.UUID(payload.artisan_user_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid artisan_user_id")

        ap = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == artisan_id).first()
        if not ap or not _is_status_approved(ap.verification_status):
            raise HTTPException(status_code=403, detail="This artisan is not available yet (awaiting approval)")

    job = Job(
        customer_id=current.id,
        artisan_id=artisan_id,
        service_category=payload.service_category,
        location=payload.location,
        description=payload.description,
        scheduled_at=payload.scheduled_at,
        status=JobStatus.pending,
        meta={}
    )
    db.add(job)
    db.flush()
    add_status_history(db, job, None, JobStatus.pending, current)
    db.commit()
    db.refresh(job)
    return to_out(job)

@router.get("/my-bookings", response_model=JobListOut)
def my_bookings(db: Session = Depends(get_db), current: User = Depends(get_current_user),
                limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    require_role(current, UserRole.customer)
    q = db.query(Job).filter(Job.customer_id == current.id).order_by(Job.created_at.desc())
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    return JobListOut(jobs=[to_out(j) for j in rows], total=total)

# artisan: requests & respond
@router.get("/requests", response_model=JobListOut)
def artisan_requests(db: Session = Depends(get_db), current: User = Depends(require_artisan_approved),
                     limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    require_role(current, UserRole.artisan)
    q = db.query(Job).filter(Job.artisan_id == current.id, Job.status == JobStatus.pending).order_by(Job.created_at.asc())
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    return JobListOut(jobs=[to_out(j) for j in rows], total=total)

@router.post("/respond", response_model=JobOut)
def respond(payload: JobRespondIn, db: Session = Depends(get_db), current: User = Depends(require_artisan_approved)):
    require_role(current, UserRole.artisan)
    try:
        jid = uuid.UUID(payload.job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job_id")

    job = db.get(Job, jid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.artisan_id != current.id:
        raise HTTPException(status_code=403, detail="Not your job")
    if job.status != JobStatus.pending:
        raise HTTPException(status_code=400, detail="Job already responded")

    new = JobStatus.accepted if payload.accept else JobStatus.cancelled
    ensure_transition(job.status, new)
    old = job.status
    job.status = new
    add_status_history(db, job, old, new, current)
    db.add(job)
    db.commit()
    db.refresh(job)
    return to_out(job)

# status: read & update
@router.get("/status/{job_id}", response_model=JobOut, responses={
    403: {"description": "Forbidden – not your job"},
    404: {"description": "Job not found"},
})
def job_status(
    job: Job = Depends(require_job_access),
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current.role == UserRole.artisan:
        ap = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == current.id).first()
        if not ap or not _is_status_approved(ap.verification_status):
            raise HTTPException(status_code=403, detail="Your artisan account is pending admin approval")
    return to_out(job)

@router.patch("/update-status/{job_id}", response_model=JobOut)
def update_status(
    payload: JobStatusUpdateIn,
    job: Job = Depends(require_job_access),
    current: User = Depends(require_artisan_approved),
    db: Session = Depends(get_db),
):
    try:
        new_status = JobStatus(payload.new_status)
    except Exception:
        raise HTTPException(status_code=400, detail="Unknown status")

    if new_status in {JobStatus.on_the_way, JobStatus.working, JobStatus.completed}:
        if current.role != UserRole.artisan or job.artisan_id != current.id:
            raise HTTPException(status_code=403, detail="Only the assigned artisan can update this status")
        ap = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == current.id).first()
        if not ap or not _is_status_approved(ap.verification_status):
            raise HTTPException(status_code=403, detail="Your artisan account is pending admin approval")

    elif new_status == JobStatus.cancelled:
        if job.status == JobStatus.completed:
            raise HTTPException(status_code=400, detail="Completed job cannot be cancelled")
        if current.id not in (job.customer_id, job.artisan_id) and current.role != UserRole.admin:
            raise HTTPException(status_code=403, detail="Not allowed to cancel")

    elif new_status == JobStatus.accepted:
        raise HTTPException(status_code=400, detail="Use /jobs/respond to accept/decline")

    ensure_transition(job.status, new_status)
    old = job.status
    job.status = new_status
    add_status_history(db, job, old, new_status, current)
    db.add(job)
    db.commit()
    db.refresh(job)
    return to_out(job)

# notes & photos
@router.post("/{job_id}/notes", response_model=JobNoteOut, status_code=201)
def add_note(
    payload: JobNoteIn,
    job: Job = Depends(require_job_access),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if current.id not in (job.customer_id, job.artisan_id) and current.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not allowed")

    # payload.note already sanitized in schema; belt-and-braces:
    safe_note = clean_free_text(payload.note, 600)

    n = JobNote(job_id=job.id, author_id=current.id, note=safe_note)
    db.add(n)
    db.commit()
    db.refresh(n)
    return JobNoteOut(
        id=str(n.id), job_id=str(job.id), author_id=str(n.author_id) if n.author_id else None, note=n.note, created_at=n.created_at
    )

@router.post("/upload-completion-photo", response_model=Message, status_code=201)
async def upload_completion_photo(
    job_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current: User = Depends(require_artisan_approved),
):
    try:
        jid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")
    job = db.get(Job, jid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if current.role != UserRole.artisan or job.artisan_id != current.id:
        raise HTTPException(status_code=403, detail="Only the assigned artisan can upload completion photos")

    job_dir = os.path.join(UPLOAD_DIR, str(job.id))
    os.makedirs(job_dir, exist_ok=True)
    filename = f"{uuid.uuid4()}_{file.filename}"
    dest = os.path.join(job_dir, filename)

    with open(dest, "wb") as out:
        out.write(await file.read())

    db.add(JobPhoto(job_id=job.id, path=dest))
    db.commit()
    return {"message": "Photo uploaded"}

# reviews
@router.post("/review/{job_id}", response_model=Message)
def review_job(job_id: str, payload: ReviewIn, db: Session = Depends(get_db), current: User = Depends(require_verified_contact)):
    try:
        jid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")
    job = db.get(Job, jid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.customer_id != current.id:
        raise HTTPException(status_code=403, detail="Only the customer can review")
    if job.status != JobStatus.completed:
        raise HTTPException(status_code=400, detail="Review allowed only after completion")

    exists = db.query(Review).filter(Review.job_id == job.id, Review.customer_id == current.id).first()
    if exists:
        raise HTTPException(status_code=400, detail="You already reviewed this job")

    db.add(Review(
        job_id=job.id,
        customer_id=current.id,
        artisan_id=job.artisan_id,
        rating=payload.rating,
        review=payload.review or ""
    ))
    db.commit()
    return {"message": "Review submitted"}

@router.post("/request-rating", response_model=Message)
def request_rating(job_id: str, db: Session = Depends(get_db), current: User = Depends(require_artisan_approved)):
    try:
        jid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")
    job = db.get(Job, jid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if current.role != UserRole.artisan or job.artisan_id != current.id:
        raise HTTPException(status_code=403, detail="Only the assigned artisan can request rating")
    if job.status != JobStatus.completed:
        raise HTTPException(status_code=400, detail="Request rating only after completion")
    return {"message": "Rating request recorded (notification dispatch not implemented in this API)"}
