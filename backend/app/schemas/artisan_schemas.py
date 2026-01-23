# schemas/artisan_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from uuid import  UUID


class ArtisanBase(BaseModel):
    fullname: str = Field(...,min_length=3, example="John Doe")
    email: EmailStr = Field(...,example="artisan@fixion.com")
    phone_number: str = Field(..., min_length=11, max_length=15, example="08012345678")
    password: str = Field(..., example="artisan")
    longitude: Optional[float] = Field(None, example=3.3792)
    latitude: Optional[float] = Field(None, example=6.5244)
    gender: str = Field(..., example="male")  
    nin: int = Field(..., example="1234567")
    service_category: str = Field(..., example="Electrician")
    service_description: Optional[str] = Field(None, example="Expert in home wiring and installations")
    is_active: Optional[bool] = Field(default=True, example=True)
    years_of_experience: int = Field(..., gt=0, example=5)  #  made this NOT optional
    role: str = Field(default="artisan", example="artisan")
    is_verified: Optional[bool] = Field(default=False, example=False)


    class Config:
        from_attributes = True
    # class Config:
    #     schema_extra = {
    #         "example": {
    #             "full_name": "John Artisan",
    #             "email": "artisan@fixion.com",
    #             "phone_number": "08012345678",
    #             "password": "StrongPass@123",
    #             "service_category": "Electrician",
    #             "service_description": "Expert in home wiring and installations",
    #             "years_of_experience": 3,
    #             "nin": "12345678901"
    #         }
    #     }

# Create artisan login schema
class ArtisanLogin(BaseModel):
    email: EmailStr = Field(example="artisan@fixion.com")
    password: str = Field(min_length=8, example="StrongPass@123")


class ArtisanCreate(ArtisanBase):
    pass
    class Config:
            from_attributes = True

class ArtisanUpdate(BaseModel):
    fullname: Optional[str] = None
    phone_number: Optional[str] = None
    years_of_experience: Optional[int] = None
    nin: Optional[str] = None
    gender: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None

    class Config:
        from_attributes = True

class Artisan(ArtisanBase):
    id: UUID


class ArtisanResponse(BaseModel):
    fullname: str
    email: EmailStr
    phone_number: str
    longitude: Optional[float]
    latitude: Optional[float]
    gender: str
    role: str
    is_active: bool
    years_of_experience: int
    service_category: str

    class Config:
        from_attributes = True