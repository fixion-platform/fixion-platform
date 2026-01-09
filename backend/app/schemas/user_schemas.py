# schemas/user_schemas.py
# from pydantic_extra_types.coordinate import Coordinates
from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
import re
from uuid import UUID

class UserBase(BaseModel):
    """Base model for user, contains shared attributes."""
    fullname : str = Field(..., description="User First name")
    email: EmailStr = Field(..., description="The user's email address")
    phone_number: str = Field(..., description="The user's phone number")
    password: str = Field(..., description="The user's password")
    role: str = Field(default="client", description="The user's role")
    latitude: float = Field(None, description="The user's latitude")
    longitude: float = Field(None, description="The user's longitude")
    gender: str = Field(..., description="The user's gender")
    is_active: bool = Field(default=True, description="Indicates if the user is active")

    @validator('fullname', 'phone_number', pre=True)
    def strip_whitespace(cls, v):
        return v.strip()
    
class User(UserBase):
    id: UUID = Field(..., description="The unique identifier for the user")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass

# class UserUpdate(BaseModel):
#     """Schema for updating user information."""
#     fullname : Optional[str] = Field(None, description="User First name")
#     email: Optional[EmailStr] = Field(None, description="The user's email address")
#     phone_number: Optional[str] = Field(None, description="The user's phone number")
#     gender: str = Field(..., description="The user's gender")
#     is_active: Optional[bool] = Field(None, description="Indicates if the user is active")

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Za-z]', v) or not re.search(r'\d', v):
            raise ValueError("Password must include both letters and numbers.")
        return v

class UserResponse(UserBase):
    """Schema for returning user data in responses."""
    id: UUID
    email: EmailStr
    fullname: str
    phone_number: str
    role: str
    gender: str

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