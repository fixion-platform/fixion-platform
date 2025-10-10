# app/schemas/auth.py
from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class TokenPair(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str

class RefreshIn(BaseModel):
    refresh_token: str

class LogoutIn(BaseModel):
    refresh_token: str

class LoginOut(TokenPair):
    pass

class TokenPayload(BaseModel):
    sub: str           # user id (uuid)
    role: str
    jti: str
    exp: int
    iat: int
    typ: str           # "access" or "refresh"

class Message(BaseModel):
    message: str 

# app/schemas/auth.py (append to file)
from pydantic import BaseModel, EmailStr

class VerifyEmailOut(BaseModel):
    message: str
    # for testing convenience, we return the token; in prod, send via email
    token_for_testing: str

    model_config = ConfigDict(from_attributes=True)

class VerifyEmailConfirmIn(BaseModel):
    token: str

class VerifyPhoneIn(BaseModel):
    phone_number: str

class VerifyPhoneOut(BaseModel):
    message: str
    otp_for_testing: str  # return OTP for Swagger testing

class VerifyPhoneConfirmIn(BaseModel):
    phone_number: str
    otp: str

