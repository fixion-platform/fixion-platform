# schemas/user_schemas.py

from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
import re

class UserBase(BaseModel):
    """Base model for user, contains shared attributes."""
    email: EmailStr
    full_name: str
    phone_number: str
    nin: str = Field(..., min_length=11, max_length=11, description="National Identification Number")

    @validator('full_name', 'phone_number', 'nin', pre=True)
    def strip_whitespace(cls, v):
        return v.strip()
    
class UserCreate(BaseModel):
    """Schema for creating a new user."""
    full_name: str
    email: EmailStr
    phone_number: str
    password: str
    nin: str
    role: str # "customer" or "artisan"

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError("Password must include both letters and numbers.")
        return v

class UserResponse(UserBase):
    """Schema for returning user data in responses."""
    id: int
    email: EmailStr
    full_name: str
    phone_number: str
    nin: str
    role: str
    email_verified: bool
    verified: Optional[bool] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for the JWT access token."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for the data encoded within the JWT."""
    email: Optional[str] = None

class CustomerPreferences(BaseModel):
    location: str
    service_preferences: List[str]    