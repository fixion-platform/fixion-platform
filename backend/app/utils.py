# utils.py
import re
from passlib.context import CryptContext
from fastapi import HTTPException, status

# Create the password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hashes a plain password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies that a plain password matches the hashed one."""
    return pwd_context.verify(plain_password, hashed_password) 

def validate_strong_password(password: str) -> str:
    """Validates password strength according to Fixion security rules."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        raise HTTPException(status_code=400, detail="Password must include an uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise HTTPException(status_code=400, detail="Password must include a lowercase letter.")
    if not re.search(r'\d', password):
        raise HTTPException(status_code=400, detail="Password must include a number.")
    if not re.search(r'[@$!%*?&]', password):
        raise HTTPException(status_code=400, detail="Password must include a special character (@$!%*?&).")
    return password


