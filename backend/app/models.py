from database import Base, declarative_base
from sqlalchemy import Column, String, ForeignKey, Boolean, Float, Integer

class UserT(Base):

    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    fullname = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    password = Column(String, nullable=False)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    gender  =  Column(String, nullable=False)
    role  =  Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    years_of_experience = Column(Integer, nullable=True)
    service_category = Column(String, nullable=True)
    service_description = Column(String, nullable=True)
    nin = Column(Integer, unique=True, nullable=True)
    is_verified = Column(Boolean, default=False)


# class ArtisanT(Base):

#     __tablename__ = "artisans"

#     id = Column(String, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     fullname = Column(String, nullable=False)
#     phone_number = Column(String, nullable=False)
#     password = Column(String, nullable=False)
#     longitude = Column(Float, nullable=True)
#     latitude = Column(Float, nullable=True)
#     years_of_experience = Column(Float, nullable=False)
#     nin = Column(Integer, unique=True, nullable=False)
#     role  =  Column(String, default="artisan", nullable=False)
#     gender  =  Column(String, nullable=False)
#     is_active = Column(Boolean, default=True)
#     is_verified = Column(Boolean, default=False)

class AdminT(Base):

    __tablename__ = "admins"

    id = Column(String, ForeignKey("users.id"), primary_key=True, index=True)


class ArtisanServiceT(Base):

    __tablename__ = "artisan_services"

    id = Column(String, primary_key=True, index=True)
    service_category = Column(String, nullable=False)
    service_description = Column(String, nullable=True)