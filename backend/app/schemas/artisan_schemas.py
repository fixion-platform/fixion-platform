# schemas/artisan_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional


class ArtisanSignup(BaseModel):
    full_name: str = Field(..., min_length=3, example="John Doe")  # type: ignore
    email: EmailStr = Field(..., example="artisan@fixion.com")  # type: ignore
    phone_number: str = Field(..., min_length=11, max_length=15, example="08012345678")  # type: ignore
    password: str = Field(..., min_length=8, example="StrongPass@123") # type: ignore
    service_category: str = Field(..., example="Plumber")  # type: ignore
    service_description: Optional[str] = Field(default=None, example="Expert in home plumbing")  # type: ignore
    years_of_experience: int = Field(..., gt=0, example=5)  #  made this NOT optional  # type: ignore
    nin: str = Field(..., min_length=11, max_length=11, example="12345678901")  # type: ignore

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Artisan",
                "email": "artisan@fixion.com",
                "phone_number": "08012345678",
                "password": "StrongPass@123",
                "service_category": "Electrician",
                "service_description": "Expert in home wiring and installations",
                "years_of_experience": 3,
                "nin": "12345678901"
            }
        }
