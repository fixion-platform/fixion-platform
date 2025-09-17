# # database.py
# from typing import Optional
# from app.utils import get_password_hash

# # --- In-memory "database" ---
# fake_users_db = {
#     "admin@fixion.com": {
#         "id": 1,
#         "email": "admin@fixion.com",
#         "full_name": "Fixion Admin",
#         "phone_number": "08000000000",
#         "hashed_password": get_password_hash("adminpass"),
#         "role": "admin",
#         "nin": "00000000000",
#         "email_verified": True,
#         "verified": True,
#     }
# }

# # Counter for assigning new IDs
# user_id_counter = 4


# # --- Utility Functions ---

# def get_user(email: str) -> Optional[dict]:
#     """Find a user by email in the fake database."""
#     return fake_users_db.get(email)


# def delete_user_by_email(email: str) -> bool:
#     """Deletes a user by email."""
#     if email in fake_users_db:
#         del fake_users_db[email]
#         return True
#     return False

from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql://user:password@localhost/artisan_db"
engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    from app.models.user import User
    from app.models.artisan import Artisan
    from app.models.admin import Admin
    from app.models.customer import Admin
    SQLModel.metadata.create_all(engine)