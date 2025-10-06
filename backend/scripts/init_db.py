# scripts/init_db.py
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, Base
from app.models import User, Wallet, ServiceCategory
from app.models.enums import UserRole

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_all():
    Base.metadata.create_all(bind=engine)
    print("Tables created")

def seed_minimum(session: Session):
    # Seed admin
    admin_email = "admin@fixion.com"
    admin = session.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin = User(
            full_name="Fixion Admin",
            email=admin_email,
            phone_number="08000000000",
            password_hash=pwd.hash("adminpass"),
            role=UserRole.admin,
            email_verified=True,
            phone_verified=True,
            is_active=True,
        )
        session.add(admin)
        session.flush()
        session.add(Wallet(user_id=admin.id, balance_kobo=0))
        print("Seeded admin: admin@fixion.com / adminpass")

    # Seed base categories
    for name in ("Plumber", "Electrician", "Carpenter"):
        exists = session.query(ServiceCategory).filter(ServiceCategory.name == name).first()
        if not exists:
            session.add(ServiceCategory(name=name, description=f"{name} services"))

    session.commit()
    print("Seeded base data")

if __name__ == "__main__":
    create_all()
    with SessionLocal() as session:
        seed_minimum(session)
    print("Init complete")
