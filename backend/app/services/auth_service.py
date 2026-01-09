# services/auth_service.py
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from typing import Optional
from  pydantic import EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from fastapi import Depends, HTTPException, status
from dotenv import load_dotenv
from models import UserT
from schemas.user_schemas import UserCreate, UserResponse
from database import get_db

load_dotenv()

# Configs
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
auth_bearer = OAuth2PasswordBearer(tokenUrl="/login")

class AuthService:
    @staticmethod
    def authenticate(user: UserCreate, db: Session = Depends(get_db)):
        details = db.query(UserT).filter(UserT.email == user.email).first()
        if not details:
            raise HTTPException(status_code=400, detail="Incorrect Email Adddress")
        if not pwd_context.verify(user.password_hash, details.password):
            raise HTTPException(status_code=400, detail ="Incorrect Password")
        return details

    @staticmethod
    # --- Password Functions ---
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    # --- Token Functions ---
    def create_access_token(email: EmailStr, id: str, expires_delta: timedelta) -> str:
        to_encode = {"email": email, "id": id}
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    # def decode_access_token(token: str) -> Optional[str]:
    #     try:
    #         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    #         return payload.get("sub")
    #     except JWTError:
    #         return None 
        
    @staticmethod
    def get_current_user(token: str =  Depends(auth_bearer), db: Session = Depends(get_db)):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("email")
            id: str = payload.get("id")
            if email is None or id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate details")
            user = db.query(UserT).filter(UserT.email == email).first()
            if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="This  User  nno  longer  exists")
            return user
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
        


auth_services = AuthService()