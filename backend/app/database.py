
# database.py

from typing import Optional
from utils import get_password_hash

# In-memory "database"
# A simple dictionary to store user data.
fake_users_db = {
    "admin@fixion.com": {
        "id": 1,
        "email": "admin@fixion.com",
        "full_name": "Fixion Admin",
        "phone_number": "08000000000",
        "hashed_password": get_password_hash("adminpass"),
        "role": "admin",
        "nin": "00000000000"
    }
}
user_id_counter = 2

def get_user(email: str) -> Optional[dict]:
    """Finds a user by email in the fake database."""
    return fake_users_db.get(email)

# For old users that don't have 'email_verified' key
for user in fake_users_db.values():
    if "email_verified" not in user:
        user["email_verified"] = False

