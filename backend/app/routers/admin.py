# app/routers/admin.py
from __future__ import annotations
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session, aliased, joinedload

from app.db.database import get_db
from app.auth_utils import require_admin
from app.utils import decrypt_str
from app.models import User, ArtisanProfile, Job, Review, Complaint, Dispute, Announcement
from app.models.payments import Payment
from app.models.enums import UserRole, VerificationStatus, JobStatus

from app.models.artisan_document import ArtisanDocument
from app.schemas.artisan_document import ArtisanDocumentOut
from app.schemas.admin_schemas import (
    AdminSummaryOut, AdminBookingListOut, AdminBookingRow,
    AdminVerifyIn, AdminAnnouncementIn, AdminBlockUserIn, Message,
    AdminUserRow, AdminUserListOut, AdminArtisanListOut, AdminArtisanRow,
    AdminComplaintListOut, AdminComplaintRow, AdminComplaintResolveIn,
    AdminDisputeListOut, AdminDisputeRow, AdminDisputeResolveIn,
    AdminAnnouncementRow, AdminAnnouncementListOut, AdminAnnouncementUpdateIn,
)

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---------- SUMMARY ----------

@router.get("/summary", response_model=AdminSummaryOut)
def admin_summary(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users_total = db.query(func.count(User.id)).scalar() or 0
    customers_total = db.query(func.count(User.id)).filter(User.role == UserRole.customer).scalar() or 0
    artisans_total = db.query(func.count(User.id)).filter(User.role == UserRole.artisan).scalar() or 0

    ap = aliased(ArtisanProfile)
    artisans_verified = db.query(func.count(ap.user_id)).filter(ap.verification_status == VerificationStatus.verified).scalar() or 0
    artisans_pending = db.query(func.count(ap.user_id)).filter(ap.verification_status == VerificationStatus.pending).scalar() or 0

    jobs_by_status = {}
    for s in JobStatus:
        c = db.query(func.count(Job.id)).filter(Job.status == s).scalar() or 0
        jobs_by_status[str(s)] = c

    reviews_total = db.query(func.count(Review.id)).scalar() or 0

    return AdminSummaryOut(
        users_total=users_total,
        customers_total=customers_total,
        artisans_total=artisans_total,
        artisans_verified=artisans_verified,
        artisans_pending=artisans_pending,
        jobs_by_status=jobs_by_status,
        reviews_total=reviews_total,
    )

# ---------- USERS LIST (ADMIN) ----------

@router.get("/users", response_model=AdminUserListOut)
def admin_list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    role: Optional[UserRole] = Query(None, description="Filter by role: customer | artisan"),
    q: Optional[str] = Query(None, description="Search name/email/phone (ILIKE)"),
    is_blocked: Optional[bool] = Query(None, description="Filter by blocked status"),
    verification_status: Optional[VerificationStatus] = Query(
        None, description="Filter artisans by verification status"
    ),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Returns both customers and artisans with optional filters.
    - If role=artisan, includes artisan profile fields.
    - If verification_status is provided, only artisans are considered.
    """
    # Base query with artisan profile eager-load (safe even for customers)
    q_users = (
        db.query(User)
        .options(joinedload(User.artisan_profile))
        .order_by(User.created_at.desc())
    )

    # Role filter (optional)
    if role is not None:
        q_users = q_users.filter(User.role == role)

    # Text search across name/email/phone
    if q:
        like = f"%{q}%"
        q_users = q_users.filter(
            (User.full_name.ilike(like)) |
            (User.email.ilike(like)) |
            (User.phone_number.ilike(like))
        )

    # Blocked filter
    if is_blocked is not None:
        q_users = q_users.filter(User.is_blocked == is_blocked)

    # If verification_status filter is specified, we only care about artisans
    if verification_status is not None:
        # Ensure we’re filtering artisans and their profile status
        q_users = (
            q_users.join(ArtisanProfile, ArtisanProfile.user_id == User.id)
                   .filter(User.role == UserRole.artisan)
                   .filter(ArtisanProfile.verification_status == verification_status)
        )

    total = q_users.count()
    rows = q_users.limit(limit).offset(offset).all()

    items: list[AdminUserRow] = []
    for u in rows:
        p = u.artisan_profile
        items.append(
            AdminUserRow(
                id=str(u.id),
                role=str(u.role),
                full_name=u.full_name,
                email=u.email,
                phone_number=decrypt_str(u.phone_number),
                is_active=bool(getattr(u, "is_active", True)),
                is_blocked=bool(getattr(u, "is_blocked", False)),
                created_at=u.created_at,
                service_category=(p.service_category if p else None),
                service_location=(p.service_location if p else None),
                verification_status=(str(p.verification_status) if p and p.verification_status else None),
            )
        )

    return AdminUserListOut(total=total, items=items)


# ---------- BOOKINGS LIST (ADMIN) ----------

@router.get("/bookings", response_model=AdminBookingListOut)
def admin_bookings(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    status_eq: Optional[JobStatus] = Query(None, description="Filter by status"),
    customer_email: Optional[str] = Query(None),
    artisan_email: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    Customer = aliased(User)
    Artisan = aliased(User)

    q = (
        db.query(
            Job.id,
            Job.job_number,
            Job.status,
            Job.service_category,
            Job.location,
            Job.created_at,
            Job.scheduled_at,
            Customer.email.label("customer_email"),
            Artisan.email.label("artisan_email"),
        )
        .outerjoin(Customer, Customer.id == Job.customer_id)
        .outerjoin(Artisan, Artisan.id == Job.artisan_id)
        .order_by(Job.created_at.desc())
    )

    if status_eq:
        q = q.filter(Job.status == status_eq)
    if customer_email:
        q = q.filter(Customer.email == customer_email)
    if artisan_email:
        q = q.filter(Artisan.email == artisan_email)

    total = q.count()
    rows = q.limit(limit).offset(offset).all()

    items = [
        AdminBookingRow(
            id=str(r.id),
            job_number=r.job_number,
            status=str(r.status),
            service_category=r.service_category,
            location=r.location,
            created_at=r.created_at,
            scheduled_at=r.scheduled_at,
            customer_email=r.customer_email,
            artisan_email=r.artisan_email,
        )
        for r in rows
    ]

    return AdminBookingListOut(total=total, items=items)

# ---------- PAYMENTS & DISPUTES (placeholders until full flows) ----------

@router.get("/payments")
def admin_payments(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    method: Optional[str] = Query(None),
    status_eq: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    q = db.query(Payment).order_by(Payment.created_at.desc())
    if method:
        q = q.filter(Payment.method == method)
    if status_eq:
        q = q.filter(Payment.status == status_eq)
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    return {
        "total": total,
        "items": [{
            "id": str(p.id),
            "reference": p.reference,
            "status": str(p.status),
            "method": str(p.method),
            "amount": float(p.amount),
            "currency": p.currency,
            "job_id": str(p.job_id) if p.job_id else None,
            "customer_id": str(p.customer_id),
            "artisan_id": str(p.artisan_id) if p.artisan_id else None,
            "created_at": p.created_at,
        } for p in rows]
    }

# ---------- DISPUTES (admin surface) ----------
@router.get("/disputes", response_model=AdminDisputeListOut)
def admin_disputes(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    status_eq: Optional[str] = Query(None, description="Filter by status: open | resolved"),
    opened_by_email: Optional[str] = Query(None, description="Filter by the email of the user who opened the dispute"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    List disputes raised by customers or artisans.  Supports optional filtering by
    dispute status and the email of the user who opened the dispute.  The
    response includes pagination metadata and a collection of dispute rows.
    """
    from sqlalchemy.orm import aliased
    OpenedBy = aliased(User)
    JobAlias = aliased(Job)
    # Base query: join opened_by to fetch email and job to fetch job number
    q = (
        db.query(Dispute, OpenedBy.email.label("opened_email"), JobAlias.job_number.label("job_number"))
        .join(OpenedBy, OpenedBy.id == Dispute.opened_by_id)
        .outerjoin(JobAlias, JobAlias.id == Dispute.job_id)
        .order_by(Dispute.created_at.desc())
    )
    if status_eq:
        q = q.filter(Dispute.status == status_eq)
    if opened_by_email:
        q = q.filter(OpenedBy.email == opened_by_email)
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    items: list[AdminDisputeRow] = []
    for d, email, job_number in rows:
        items.append(
            AdminDisputeRow(
                id=str(d.id),
                status=str(d.status),
                opened_by_email=email,
                job_number=job_number,
                reason=d.reason,
                created_at=d.created_at,
            )
        )
    return AdminDisputeListOut(total=total, items=items)

# Resolve a dispute (admin action)
@router.post("/disputes/{dispute_id}/resolve", response_model=Message)
def admin_disputes_resolve(
    dispute_id: str,
    payload: AdminDisputeResolveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Resolve an open dispute.  The admin provides resolution notes which are
    persisted on the dispute record.  Only open disputes can be resolved.
    """
    from app.models.enums import DisputeStatus
    dispute = db.query(Dispute).filter(Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dispute not found")
    if dispute.status != DisputeStatus.open:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Dispute already resolved")
    dispute.status = DisputeStatus.resolved
    dispute.resolved_by_admin_id = admin.id
    dispute.resolution_notes = payload.resolution_notes
    db.add(dispute)
    db.commit()
    return Message(message="Dispute resolved")

@router.post("/payments/{payment_id}/refund")
def admin_payment_refund_placeholder(payment_id: str, admin: User = Depends(require_admin)):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Payment refund not implemented yet")

# ---------- REVIEWS ----------

@router.get("/reviews")
def admin_reviews(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    Customer = aliased(User)
    Artisan = aliased(User)

    q = (
        db.query(
            Review.id,
            Review.rating,
            Review.review,
            Review.created_at,
            Customer.email.label("customer_email"),
            Artisan.email.label("artisan_email"),
            Review.job_id,
        )
        .outerjoin(Customer, Customer.id == Review.customer_id)
        .outerjoin(Artisan, Artisan.id == Review.artisan_id)
        .order_by(Review.created_at.desc())
    )
    total = q.count()
    rows = q.limit(limit).offset(offset).all()

    return {
        "total": total,
        "items": [
            {
                "id": str(r.id),
                "job_id": str(r.job_id) if r.job_id else None,
                "rating": r.rating,
                "review": r.review,
                "created_at": r.created_at,
                "customer_email": r.customer_email,
                "artisan_email": r.artisan_email,
            }
            for r in rows
        ],
    }

# ---------- USER MANAGEMENT (BLOCK/UNBLOCK) ----------

@router.patch("/block-user/{email}", response_model=Message)
def block_user(email: str, payload: AdminBlockUserIn, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    u = db.query(User).filter(User.email == email).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u.is_blocked = bool(payload.block)
    db.add(u)
    db.commit()
    return {"message": ("User blocked" if payload.block else "User unblocked")}

# ---------- ARTISAN VERIFY/REJECT (admin surface) ----------

@router.post("/verify-artisan/{email}", response_model=Message)
def verify_artisan(email: str, payload: AdminVerifyIn, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    # Find artisan user
    u = db.query(User).filter(User.email == email, User.role == UserRole.artisan).first()
    if not u:
        raise HTTPException(status_code=404, detail="Artisan user not found")

    p = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == u.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Artisan profile not found")

    if payload.approve:
        p.verification_status = VerificationStatus.verified
        p.rejection_reason = None
        p.verified_by_admin_id = admin.id
        msg = "Artisan verified"
    else:
        # prefer 'rejected' if present; otherwise fall back to pending/cancelled conventions
        p.verification_status = getattr(VerificationStatus, "rejected", getattr(VerificationStatus, "cancelled", VerificationStatus.pending))
        p.rejection_reason = payload.rejection_reason or "Not approved"
        p.verified_by_admin_id = admin.id
        msg = "Artisan rejected"

    db.add(p)
    db.commit()
    return {"message": msg}

@router.post("/reject-artisan/{email}", response_model=Message)
def reject_artisan(email: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    """
    Explicit reject endpoint for Swagger clarity. Equivalent to verify with approve=False.
    """
    u = db.query(User).filter(User.email == email, User.role == UserRole.artisan).first()
    if not u:
        raise HTTPException(status_code=404, detail="Artisan user not found")

    p = db.query(ArtisanProfile).filter(ArtisanProfile.user_id == u.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Artisan profile not found")

    p.verification_status = getattr(VerificationStatus, "rejected", getattr(VerificationStatus, "cancelled", VerificationStatus.pending))
    p.rejection_reason = "Not approved"
    p.verified_by_admin_id = admin.id

    db.add(p)
    db.commit()
    return {"message": "Artisan rejected"}

# ---------- ARTISANS PENDING VERIFICATION (admin surface) ----------
@router.get("/artisans/pending", response_model=AdminArtisanListOut)
def admin_pending_artisans(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    q: Optional[str] = Query(None, description="Filter by name or email"),
    category: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    List artisans whose profiles are still pending admin verification.
    Admin-only.
    """
    # Join User <- ArtisanProfile for only artisan users
    query = (
        db.query(User, ArtisanProfile)
        .join(ArtisanProfile, ArtisanProfile.user_id == User.id)
        .filter(User.role == UserRole.artisan)
        .filter(ArtisanProfile.verification_status == VerificationStatus.pending)
        .order_by(User.created_at.desc())
    )

    if q:
        like = f"%{q}%"
        query = query.filter((User.full_name.ilike(like)) | (User.email.ilike(like)))

    if category:
        query = query.filter(ArtisanProfile.service_category == category)

    total = query.count()
    rows = query.limit(limit).offset(offset).all()

    items = [
        AdminArtisanRow(
            user_id=str(u.id),
            full_name=u.full_name,
            email=u.email,
            phone_number=decrypt_str(u.phone_number),
            service_category=p.service_category,
            created_at=u.created_at,
            verification_status=str(p.verification_status),
            rejection_reason=p.rejection_reason,
        )
        for (u, p) in rows
    ]

    return AdminArtisanListOut(total=total, items=items)

# ---------- ARTISAN DOCUMENTS (admin surface) ----------
@router.get("/artisans/{artisan_user_id}/documents", response_model=list[ArtisanDocumentOut])
def admin_list_artisan_documents(
    artisan_user_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    List all documents an artisan has uploaded (admin only).
    """
    # Ensure the user exists (optional: ensure role == artisan)
    user = db.query(User).filter(User.id == artisan_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Artisan user not found")

    docs = (
        db.query(ArtisanDocument)
        .filter(ArtisanDocument.user_id == artisan_user_id)
        .order_by(ArtisanDocument.created_at.desc())
        .all()
    )
    return docs

# Fetch a single document by id for a given artisan
@router.get("/artisans/{artisan_user_id}/documents/{document_id}", response_model=ArtisanDocumentOut)
def admin_get_artisan_document(
    artisan_user_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Fetch a single artisan document by id (admin only).
    """
    doc = (
        db.query(ArtisanDocument)
        .filter(
            ArtisanDocument.id == document_id,
            ArtisanDocument.user_id == artisan_user_id,
        )
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found for this artisan")
    return doc

# ---------- COMPLAINTS (placeholders until model exists) ----------
@router.get("/complaints", response_model=AdminComplaintListOut)
def admin_list_complaints(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
    status_eq: Optional[str] = Query(None, description="Filter by complaint status"),
    q: Optional[str] = Query(None, description="Search title/description (ILIKE)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """
    Lists complaints with optional filtering by status and a simple ILIKE search
    on title/description. Robust to missing ORM relationships by joining via FK columns.
    """
    # Figure out which FK columns exist on Complaint
    # We will try these in order for the "who opened the complaint" user FK:
    candidate_user_fk_names = ("opened_by_id", "user_id", "raised_by_id", "created_by_id", "author_id")
    user_fk_col = None
    for name in candidate_user_fk_names:
        if hasattr(Complaint, name):
            user_fk_col = getattr(Complaint, name)
            break

    # Job FK (optional)
    job_fk_col = getattr(Complaint, "job_id", None)

    # Build base query
    RaisedBy = aliased(User)
    q_base = db.query(
        Complaint,
        (RaisedBy.email if user_fk_col is not None else func.null()).label("raised_by_email"),
        (Job.job_number if job_fk_col is not None else func.null()).label("job_number"),
    )

    # Apply joins only if FK cols exist
    if user_fk_col is not None:
        q_base = q_base.outerjoin(RaisedBy, user_fk_col == RaisedBy.id)
    if job_fk_col is not None:
        q_base = q_base.outerjoin(Job, job_fk_col == Job.id)

    # Filters
    if status_eq:
        q_base = q_base.filter(Complaint.status == status_eq)
    if q:
        like = f"%{q.strip()}%"
        # title/description assumed string columns (present in your model)
        q_base = q_base.filter((Complaint.title.ilike(like)) | (Complaint.description.ilike(like)))

    q_base = q_base.order_by(Complaint.created_at.desc())

    total = q_base.count()
    rows = q_base.limit(limit).offset(offset).all()

    items: list[AdminComplaintRow] = []
    for c, raised_by_email, job_number in rows:
        items.append(
            AdminComplaintRow(
                id=str(c.id),
                title=getattr(c, "title", ""),
                status=str(getattr(c, "status", "")),
                raised_by_email=raised_by_email,
                job_number=job_number,
                created_at=c.created_at,
            )
        )

    return AdminComplaintListOut(total=total, items=items)


@router.post("/complaints/{complaint_id}/resolve", response_model=Message)
def admin_resolve_complaint(
    complaint_id: str,
    payload: AdminComplaintResolveIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Marks a complaint as resolved and records resolution notes.
    Idempotent: re-resolving an already-resolved complaint just updates notes.
    """
    try:
        cid = uuid.UUID(complaint_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid complaint id")

    c = db.query(Complaint).filter(Complaint.id == cid).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")

    # Set status to resolved (supports enum or string)
    try:
        # If you have enums, use them, otherwise string is fine
        from app.models.enums import ComplaintStatus as _ComplaintStatus  # type: ignore
        c.status = _ComplaintStatus.resolved
    except Exception:
        c.status = "resolved"

    notes = (payload.resolution_notes or "").strip()
    if hasattr(c, "resolution_notes"):
        c.resolution_notes = notes
    if hasattr(c, "resolved_by_admin_id"):
        c.resolved_by_admin_id = admin.id

    db.add(c)
    db.commit()
    return {"message": "Complaint resolved"}

# ---------- ANNOUNCEMENTS ----------

# Create a new announcement
@router.post("/announcement", response_model=Message, status_code=201)
def admin_announcement(
    payload: AdminAnnouncementIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create an announcement that will be displayed to end users.  The title and body
    are persisted in the database and can be retrieved by clients.  This
    endpoint returns a success message upon creation.
    """
    from app.security.sanitize import clean_free_text
    title = clean_free_text(payload.title, 200)
    body = clean_free_text(payload.body, 2000)
    ann = Announcement(
        title=title,
        message=body,
        created_by_admin_id=admin.id,
        is_active=True,
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return Message(message="Announcement created")

# List announcements for admin with optional filter
@router.get("/announcements", response_model=AdminAnnouncementListOut)
def admin_announcements(
    only_active: Optional[bool] = Query(None, description="Filter by active status"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Returns a paginated list of announcements created by admins.  Optionally filters
    by the `is_active` flag.  Each row includes the creator's email.
    """
    from sqlalchemy.orm import aliased
    CreatedBy = aliased(User)
    q = (
        db.query(Announcement, CreatedBy.email.label("created_by_email"))
        .join(CreatedBy, CreatedBy.id == Announcement.created_by_admin_id)
        .order_by(Announcement.created_at.desc())
    )
    if only_active is not None:
        q = q.filter(Announcement.is_active == only_active)
    total = q.count()
    rows = q.limit(limit).offset(offset).all()
    items: list[AdminAnnouncementRow] = []
    for ann, email in rows:
        items.append(
            AdminAnnouncementRow(
                id=str(ann.id),
                title=ann.title,
                message=ann.message,
                created_at=ann.created_at,
                created_by_email=email,
                is_active=bool(ann.is_active),
            )
        )
    return AdminAnnouncementListOut(total=total, items=items)

# Update or deactivate an existing announcement
@router.patch("/announcements/{announcement_id}", response_model=Message)
def admin_update_announcement(
    announcement_id: str,
    payload: AdminAnnouncementUpdateIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update an existing announcement.  Allows changing the title, message body, and
    active status.  Fields that are not provided in the payload are left unchanged.
    """
    ann = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")

    from app.security.sanitize import clean_free_text
    updated = False
    if payload.title is not None:
        new_title = clean_free_text(payload.title, 200)
        if new_title:
            ann.title = new_title
            updated = True
    if payload.body is not None:
        new_body = clean_free_text(payload.body, 2000)
        if new_body:
            ann.message = new_body
            updated = True
    if payload.is_active is not None:
        ann.is_active = bool(payload.is_active)
        updated = True
    if updated:
        db.add(ann)
        db.commit()
    return Message(message="Announcement updated")

@router.get("/reports/analytics", response_model=dict)
def admin_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    # Users
    total_users = db.query(func.count(User.id)).scalar() or 0
    artisans = db.query(func.count(User.id)).filter(User.role == "artisan").scalar() or 0
    customers = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0

    # Jobs
    jobs_total = db.query(func.count(Job.id)).scalar() or 0
    jobs_by_status = dict(db.query(Job.status, func.count(Job.id)).group_by(Job.status).all())

    # Payments (sum) — harmless even if payments table is empty
    try:
        payments_total = db.query(func.coalesce(func.sum(Payment.amount), 0)).scalar() or 0
    except Exception:
        payments_total = 0

    return {
        "users": {"total": total_users, "artisans": artisans, "customers": customers},
        "jobs": {"total": jobs_total, "by_status": jobs_by_status},
        "payments": {"total_amount": float(payments_total)},
    }
