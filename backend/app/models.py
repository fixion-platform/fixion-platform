from database import Base, declarative_base
from sqlalchemy import Column, String, ForeignKey, Boolean, Float

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
    role  =  Column(String, default="client", nullable=False)
    is_active = Column(Boolean, default=True)


# class ArtisanT(Base):

#     __tablename__ = "artisans"

#     id = Column(String, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     firstname = Column(String, nullable=False)
#     phone_number = Column(String, nullable=False)
#     password = Column(String, nullable=False)
#     location = Column(String, default="artisan", nullable=False)
#     gender  =  Column(String, nullable=False)
#     is_active = Column(Boolean, default=True)

class AdminT(Base):

    __tablename__ = "admins"

    id = Column(String, ForeignKey("users.id"), primary_key=True, index=True)