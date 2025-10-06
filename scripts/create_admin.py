# scripts/create_admin.py
from app.db.database import SessionLocal
from app.models.user import User
from app.utils import get_password_hash, encrypt_str
from app.config import PLATFORM_FEE_USER_EMAIL
import os, sys

def main():
    email = os.getenv("ADMIN_EMAIL", PLATFORM_FEE_USER_EMAIL).strip().lower()
    full_name = os.getenv("ADMIN_NAME", "Fixion Admin")
    phone = os.getenv("ADMIN_PHONE", "08000000000")
    password = os.getenv("ADMIN_PASSWORD")

    if not email:
        print("ERROR: Set PLATFORM_FEE_USER_EMAIL or ADMIN_EMAIL")
        sys.exit(1)
    if not password:
        print("ERROR: Provide ADMIN_PASSWORD (env) for initial admin")
        sys.exit(1)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"[ok] Admin already exists: {email}")
            return

        u = User(
            email=email,
            full_name=full_name,
            phone_number=encrypt_str(phone),
            role="admin",
            is_active=True,
            email_verified=True,
            phone_verified=True,
        )
        if hasattr(User, "password_hash"):
            u.password_hash = get_password_hash(password)
        elif hasattr(User, "hashed_password"):
            u.hashed_password = get_password_hash(password)
        else:
            print("ERROR: User model has no password field")
            sys.exit(1)

        db.add(u)
        db.commit()
        print(f"[created] Admin: {email}")
    except Exception as e:
        db.rollback()
        print("ERROR:", e)
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
