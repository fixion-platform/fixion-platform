# # routers/admin.py

from  fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from  services.admin import adminServices
from  database import get_db, engine
from models import Base
from services.auth_service import auth_services

Base.metadata.create_all(bind=engine)

admin_router = APIRouter(tags=["Admin"])


@admin_router.get("/admin/users")
def get_all_users(db: Session =  Depends(get_db)):
    details = adminServices.get_all_users(db)
    return details

@admin_router.get("/admin/admins")
def get_all_admins(db: Session =  Depends(get_db)):
    details = adminServices.get_all_admins(db)
    return details 

@admin_router.get("/admin/all")
def get_all(db: Session =  Depends(get_db)):
    details = adminServices.all(db)
    return details

@admin_router.delete("/admin/delete-user/{user_id}")
def delete_user(user_id: str, db: Session =  Depends(get_db)):
    details = adminServices.delete_user(user_id, db)
    return details

@admin_router.get("/admin/user/{user_id}")
def get_user_by_id(user_id: str, db: Session =  Depends(get_db)):
    details = adminServices.get_user_by_id(user_id, db)
    return details
# from fastapi import APIRouter, Depends, HTTPException, status
# from typing import List

# from database import fake_users_db
# from schemas.user_schemas import UserResponse
# from auth_utils import ensure_admin

# router = APIRouter()


# @router.post("/admin/verify-artisan/{email}", tags=["Admin"])
# def verify_artisan(email: str, current_user: UserResponse = Depends(ensure_admin)):
#     """
#     Admin-only route to verify an artisan's account after document review.
#     """
#     # Step 1: Check if artisan exists
#     artisan = fake_users_db.get(email)
#     if not artisan:
#         raise HTTPException(status_code=404, detail="Artisan not found")

#     # Step 2: Confirm the user is actually an artisan
#     if artisan.get("role") != "artisan":
#         raise HTTPException(status_code=400, detail="User is not an artisan")

#     # Step 3: Mark artisan as verified
#     artisan["verified"] = True

#     return {
#         "message": f"{artisan['full_name']} has been verified.",
#         "artisan": {
#             "email": artisan["email"],
#             "verified": artisan["verified"]
#         }
#     }


# @router.get("/admin/pending-artisans", response_model=List[UserResponse], tags=["Admin"])
# def get_pending_artisans(current_user: UserResponse = Depends(ensure_admin)):
#     """
#      Admin-only route to list all unverified artisans.
#     """
#     pending_artisans = [
#         UserResponse(**user) for user in fake_users_db.values()
#         if user.get("role") == "artisan" and not user.get("verified", False)
#     ]

#     return pending_artisans
