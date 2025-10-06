# app/schemas/artisan.py
from __future__ import annotations
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ArtisanMeOut(BaseModel):
    user_id: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    role: str

    service_category: Optional[str] = None
    service_description: Optional[str] = None
    years_of_experience: int = 0
    work_hours: Optional[str] = None
    service_location: Optional[str] = None

    base_price_naira: Optional[float] = None

    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    account_name: Optional[str] = None

    verification_status: str
    rejection_reason: Optional[str] = None
 
    model_config = ConfigDict(from_attributes=True)

class ArtisanUpdateIn(BaseModel):
    service_category: Optional[str] = None
    service_description: Optional[str] = None
    years_of_experience: Optional[int] = None
    work_hours: Optional[str] = None
    service_location: Optional[str] = None

    base_price_naira: Optional[float] = None

class BankDetailsIn(BaseModel):
    bank_name: str
    account_number: str
    account_name: str

class ArtisanListOut(BaseModel):
    user_id: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    service_category: Optional[str] = None
    service_location: Optional[str] = None

    base_price_naira: Optional[float] = None

    verification_status: str

    model_config = ConfigDict(from_attributes=True)

class VerifyActionIn(BaseModel):
    approve: bool
    rejection_reason: Optional[str] = None
