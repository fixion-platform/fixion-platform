# app/security/rbac.py
from __future__ import annotations
import uuid
from fastapi import Depends, HTTPException, Path, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.auth_utils import get_current_user
from app.models.enums import UserRole
from app.models import User, Job
from app.models.payments import Payment

def _forbidden(msg="Forbidden"):
    raise HTTPException(status_code=403, detail=msg)

# Role guards
def require_admin(current: User = Depends(get_current_user)) -> User:
    if current.role != UserRole.admin:
        _forbidden("Admin only")
    return current

def require_self_or_admin(
    user_id: str = Path(..., description="Target user id"),
    current: User = Depends(get_current_user),
) -> User:
    if current.role == UserRole.admin or str(current.id) == str(user_id):
        return current
    _forbidden("You can only act on your own account")

def require_customer_self(current: User = Depends(get_current_user)) -> User:
    if current.role == UserRole.customer:
        return current
    _forbidden("Customers only")

def require_artisan_self(current: User = Depends(get_current_user)) -> User:
    if current.role == UserRole.artisan:
        return current
    _forbidden("Artisans only")

# Resource access guards
def require_job_access(
    job_id: str = Path(..., description="Job id"),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> Job:
    try:
        jid = uuid.UUID(job_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job id")

    job = db.get(Job, jid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current.role == UserRole.admin or current.id in (job.customer_id, job.artisan_id):
        return job

    _forbidden("You are not allowed to access this job")

# Use this when the route URL has /{payment_id}
def require_payment_access_by_path(
    payment_id: str = Path(..., description="Payment id"),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> Payment:
    try:
        pid = uuid.UUID(payment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payment id")

    p = db.get(Payment, pid)
    if not p:
        raise HTTPException(status_code=404, detail="Payment not found")

    if current.role == UserRole.admin or current.id in (p.customer_id, p.artisan_id):
        return p

    _forbidden("You are not allowed to access this payment")

# Use this when payment is identified via query ?payment_id=... or ?reference=...
def require_payment_access_by_query(
    payment_id: str | None = Query(None, description="Payment id"),
    reference: str | None = Query(None, description="Payment reference"),
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> Payment:
    q = None
    if payment_id:
        try:
            pid = uuid.UUID(payment_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payment id")
        q = db.query(Payment).filter(Payment.id == pid)
    elif reference:
        q = db.query(Payment).filter(Payment.reference == reference)
    else:
        raise HTTPException(status_code=400, detail="Provide payment_id or reference")

    p = q.first()
    if not p:
        raise HTTPException(status_code=404, detail="Payment not found")

    if current.role == UserRole.admin or current.id in (p.customer_id, p.artisan_id):
        return p

    _forbidden("You are not allowed to access this payment")
