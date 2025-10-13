# app/schemas/user_schemas.py
from __future__ import annotations
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

from app.security.sanitize import (
    clean_name, clean_phone, clean_email_lower, clean_free_text
)

# small helpers (no external deps)
def _clean_email_lower(v: str | None) -> str | None:
    if v is None:
        return None
    return v.strip().lower()


# Public read model

class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str
    location: Optional[str] = None
    service_preferences: Dict[str, Any] = Field(default_factory=dict)
    email_verified: bool
    phone_verified: bool
    is_active: bool
    is_blocked: bool

    model_config = ConfigDict(from_attributes=True)


# Shared signup fields (NO role here)

class BaseSignup(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    phone_number: Optional[str] = Field(None, min_length=7, max_length=32)
    password: str = Field(..., min_length=8, max_length=128)
    nin: Optional[str] = Field(None, min_length=4, max_length=20)

    @field_validator("full_name")
    @classmethod
    def _v_full_name(cls, v: str) -> str:
        v = clean_name(v, 80)
        if len(v) < 2:
            raise ValueError("Full name is too short")
        return v

    @field_validator("email")
    @classmethod
    def _v_email(cls, v: EmailStr) -> EmailStr:
        # Return the cleaned string; Pydantic will keep it as EmailStr
        cleaned = _clean_email_lower(str(v))
        return cleaned  # type: ignore[return-value]

    @field_validator("phone_number")
    @classmethod
    def _v_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v = clean_phone(v, 32)
        if len(v) < 7:
            raise ValueError("Phone number looks invalid")
        return v

    @field_validator("nin")
    @classmethod
    def _v_nin(cls, v: Optional[str]) -> Optional[str]:
        return clean_free_text(v, 20) if v else None


# Customer signup (explicit role; unknown fields forbidden)

class SignupCustomerIn(BaseSignup):
    role: str = "customer"

    # Reject any unexpected fields
    model_config = ConfigDict(extra="forbid")


# Artisan signup (NO role field; unknown fields now IGNORED; all artisan fields OPTIONAL)

class SignupArtisanIn(BaseSignup):
    # >>> CHANGED: these are now optional (default None) <<<
    service_category: Optional[str] = Field(None, min_length=2, max_length=60)
    service_description: Optional[str] = Field(None, max_length=600)
    years_of_experience: Optional[int] = Field(None, ge=0, le=80)

    @field_validator("service_category")
    @classmethod
    def _v_cat(cls, v: Optional[str]) -> Optional[str]:
        return clean_free_text(v, 60) if v is not None else None

    @field_validator("service_description")
    @classmethod
    def _v_desc(cls, v: Optional[str]) -> Optional[str]:
        return clean_free_text(v, 600) if v else None

    # >>> CHANGED: ignore FE-only extras (gender, portfolio_link, confirm_password, etc.) <<<
    model_config = ConfigDict(extra="ignore")


# Profile & preferences

class UpdateProfileIn(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=80)
    phone_number: Optional[str] = Field(None, min_length=7, max_length=32)
    location: Optional[str] = Field(None, min_length=2, max_length=120)

    @field_validator("full_name")
    @classmethod
    def _v_full_name_u(cls, v: Optional[str]) -> Optional[str]:
        return clean_name(v, 80) if v is not None else None

    @field_validator("phone_number")
    @classmethod
    def _v_phone_u(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v = clean_phone(v, 32)
        if v and len(v) < 7:
            raise ValueError("Phone number looks invalid")
        return v

    @field_validator("location")
    @classmethod
    def _v_location(cls, v: Optional[str]) -> Optional[str]:
        return clean_free_text(v, 120) if v is not None else None


class PreferencesIn(BaseModel):
    service_preferences: Dict[str, Any] = Field(default_factory=dict)


class Empty(BaseModel):
    pass
