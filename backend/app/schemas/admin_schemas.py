# app/schemas/admin.py
from __future__ import annotations
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class Message(BaseModel):
    message: str

class AdminSummaryOut(BaseModel):
    users_total: int
    customers_total: int
    artisans_total: int
    artisans_verified: int
    artisans_pending: int
    jobs_by_status: Dict[str, int]
    reviews_total: int

    model_config = ConfigDict(from_attributes=True)

class AdminBookingsFilter(BaseModel):
    status: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    artisan_email: Optional[EmailStr] = None

class AdminBookingRow(BaseModel):
    id: str
    job_number: int
    status: str
    service_category: str
    location: str
    created_at: datetime
    scheduled_at: Optional[datetime] = None
    customer_email: Optional[EmailStr] = None
    artisan_email: Optional[EmailStr] = None

class AdminBookingListOut(BaseModel):
    total: int
    items: List[AdminBookingRow]

    model_config = ConfigDict(from_attributes=True)

class AdminVerifyIn(BaseModel):
    approve: bool
    rejection_reason: Optional[str] = None

class AdminAnnouncementIn(BaseModel):
    title: str
    body: str

# ------------------------
# Announcement DTOs (Admin)
#
# These schemas are used for listing and updating announcements in the
# admin dashboard.  They include the `is_active` flag and the email
# of the admin who created the announcement so that administrators
# can manage the lifecycle of announcements without exposing this
# information to end users.

class AdminAnnouncementRow(BaseModel):
    id: str
    title: str
    message: str
    created_at: datetime
    created_by_email: Optional[EmailStr] = None
    is_active: bool

class AdminAnnouncementListOut(BaseModel):
    total: int
    items: List[AdminAnnouncementRow]

    model_config = ConfigDict(from_attributes=True)

class AdminAnnouncementUpdateIn(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    is_active: Optional[bool] = None

class AdminBlockUserIn(BaseModel):
    block: bool

class AdminUserRow(BaseModel):
    id: str
    role: str
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    is_active: bool
    is_blocked: bool
    created_at: datetime

    # Artisan-only context (None for customers)
    service_category: Optional[str] = None
    service_location: Optional[str] = None
    verification_status: Optional[str] = None

class AdminUserListOut(BaseModel):
    total: int
    items: List[AdminUserRow]    

    model_config = ConfigDict(from_attributes=True)

class AdminArtisanRow(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    service_category: Optional[str] = None
    created_at: datetime
    verification_status: str
    rejection_reason: Optional[str] = None

class AdminArtisanListOut(BaseModel):
    total: int
    items: List[AdminArtisanRow]   

    model_config = ConfigDict(from_attributes=True)

# Complaints DTOs (Admin)

class AdminComplaintRow(BaseModel):
    id: str
    title: str
    status: str
    raised_by_email: Optional[EmailStr] = None
    job_number: Optional[int] = None
    created_at: datetime

class AdminComplaintListOut(BaseModel):
    total: int
    items: List[AdminComplaintRow]

    model_config = ConfigDict(from_attributes=True)

class AdminComplaintResolveIn(BaseModel):
    resolution_notes: str

# --------------------
# Disputes DTOs (Admin)
#
# These mirror the structure used for complaints, allowing the admin
# dashboard to list and resolve disputes raised by users against job
# transactions.  They are defined here to avoid coupling business
# logic with the router module.

class AdminDisputeRow(BaseModel):
    id: str
    status: str
    opened_by_email: Optional[EmailStr] = None
    job_number: Optional[int] = None
    reason: str
    created_at: datetime

class AdminDisputeListOut(BaseModel):
    total: int
    items: List[AdminDisputeRow]

    model_config = ConfigDict(from_attributes=True)

class AdminDisputeResolveIn(BaseModel):
    resolution_notes: str

