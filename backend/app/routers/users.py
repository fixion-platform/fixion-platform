# routers/users.py
from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
# from auth_utils import ensure_admin, get_current_active_user, get_password_hash
from schemas.user_schemas import UserResponse, UserCreate, UserLogin, CustomerPreferences, Token,  UserUpdate, UserResponse
from database import get_db
from services.auth_service import auth_services
from models import UserT
import uuid
from uuid import UUID
from services.auth_service import ACCESS_TOKEN_EXPIRE_MINUTES
import logging
from services.auth_service import auth_services

user_router = APIRouter(
    prefix="/users"
)



@user_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Users"])
async def create_user(user: UserCreate,  db: Session = Depends(get_db)):
    """
    Handles user registration for both Customers and Artisans.
    """

    details = db.query(UserT).filter(UserT.email  == user.email).first()
    if details:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserT(id=str(uuid.uuid4()), **user.model_dump(exclude={"password"}), password=auth_services.get_password_hash(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse.from_orm(new_user)

@user_router.get("/me", response_model=UserResponse, tags=["Users"])
async def profile(current_user: UserResponse = Depends(auth_services.get_current_user), db:  Session = Depends(get_db)):
    """
    Fetches the details of the currently authenticated user.
    """
    return current_user

@user_router.post("/login", response_model=Token)
def login(formdata: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    detail = auth_services.authenticate(UserLogin(email=formdata.username, password=formdata.password), db)
    if not detail:
        raise HTTPException(status_code=400, detail="Invalid Login Credentials")
    access_token = auth_services.create_access_token(detail.email, detail.id, expires_delta=ACCESS_TOKEN_EXPIRE_MINUTES)
    return {"access_token": access_token, "token_type": "bearer"}



@user_router.patch("/update_profile", response_model=UserResponse)
def update_details(user: UserUpdate,current_user: UserResponse = Depends(auth_services.get_current_user), db: Session = Depends(get_db)):
    details = db.query(UserT).filter(UserT.id == str(current_user.id)).first()
    if not details:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in user.model_dump().items():
        if value is not None:
            setattr(details, key, value)
    db.commit()
    db.refresh(details)
    return details
# @user_router.get()

# USER SIGNUP (CUSTOMERS ONLY)
# @user_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Users"])
# async def create_user(user: UserCreate,  db: Session = Depends(get_db)):
#     """
#     Handles user registration for both Customers and Artisans.
#     """

#     details = db.query(UserT).filter(UserT.email  == user.email).first()
#     if details:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = UserT(id=str(uuid.uuid4), **user.model_dump(exclude={"password"}), password=get_password_hash(user.password))
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return UserResponse.from_orm(new_user)
    # global user_id_counter  # Use the global counter from database.py 

    #  Prevent users from registering as admin
    # if user.role == "admin":
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="You cannot register directly as an admin.",
    #     )

    #  Check if user already exists
    # if get_user(user.email):
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Email already registered",
    #     )

    #  Check for duplicate NIN
    # for existing_user in fake_users_db.values():
    #     if existing_user.get("nin") == user.nin:
    #         raise HTTPException(
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #             detail="NIN already registered",
    #         )

    #  Hash the password
    # hashed_password = get_password_hash(user.password)

    # #  Prepare new user data
    # new_user_data = user.model_dump()
    # new_user_data.pop("password")
    # new_user_data["hashed_password"] = hashed_password
    # new_user_data["id"] = user_id_counter 
    # new_user_data["email_verified"] = False 
    # new_user_data["location"] = ""
    # new_user_data["service_preferences"] = []

    # #  Save to fake DB using email as key
    # fake_users_db[user.email] = new_user_data
    # user_id_counter += 1 

    # return UserResponse(
    #     id=new_user_data["id"],
    #     email=new_user_data["email"],
    #     full_name=new_user_data["full_name"],
    #     phone_number=new_user_data["phone_number"],
    #     nin=new_user_data["nin"],
    #     role=new_user_data["role"],
    #     email_verified=new_user_data["email_verified"] 
    # ) 

#  EMAIL VERIFICATION ROUTE (FOR CUSTOMERS ONLY)
# @user_router.post("/verify-email", tags=["Users"])
# async def verify_email(
#     email: str = Query(..., description="Email to verify"),
# ):
#     """
#     Simulates customer email verification. Artisans are verified by Admin only.
#     """
#     user = fake_users_db.get(email)

#     if not user:
#         logging.warning(f"EMAIL VERIFY FAILED - USER NOT FOUND: {email}")
#         raise HTTPException(status_code=404, detail="User not found")

#     if user["role"] == "artisan":
#         logging.warning(f"EMAIL VERIFY BLOCKED - ARTISAN ATTEMPT: {email}")
#         raise HTTPException(status_code=403, detail="Artisan email verification is handled by admin.")

#     if user.get("email_verified"):
#         return {"message": "Email already verified."}

#     user["email_verified"] = True
#     logging.info(f"EMAIL VERIFIED: {email}")
#     return {"message": "Email successfully verified."}

# # CURRENT USER PROFILE
# @router.get("/me", response_model=UserResponse, tags=["Users"])
# async def read_users_me(current_user: UserResponse = Depends(get_current_active_user)):
#     """
#     Fetches the details of the currently authenticated user.
#     """
#     return current_user

# # UPDATE CUSTOMER PREFERENCES
# @user_router.put("/preferences", tags=["Users"])
# async def update_preferences(
#     preferences: CustomerPreferences,
#     current_user: UserResponse = Depends(get_current_active_user)
# ):
    
#     """
#     Allows customers to update their location and service preferences.
#     """
#     if current_user.role != "customer":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only customers can update preferences."
#         )

#     user = fake_users_db.get(current_user.email)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user["location"] = preferences.location
#     user["service_preferences"] = preferences.service_preferences

#     return {
#         "message": "Preferences updated successfully",
#         "location": preferences.location,
#         "service_preferences": preferences.service_preferences
#     }

# # ADMIN VIEW ALL NON-ADMIN USERS
# @user_router.get("/", response_model=List[UserResponse], tags=["Admin"])
# async def get_all_users(current_user: UserResponse = Depends(ensure_admin)):
#     """
#     Admin can retrieve all non-admin users.
#     """
#     if current_user.role != "admin":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Only admins can access this route."
#         )

#     #  Return only non-admin users
#     users = [user for user in fake_users_db.values() if user["role"] != "admin"]
#     return users

# @user_router.delete("/me", status_code=204)
# async def delete_my_account(current_user: UserResponse = Depends(get_current_active_user)):
#     """
#     Permanently delete the current user's account.
#     """
#     success = delete_user_by_email(current_user.email)
#     if not success:
#         raise HTTPException(
#             status_code=500,
#             detail="Something went wrong while deleting your account."
#         ) 
#     logging.info(f"ACCOUNT DELETED: {current_user.email}")
#     return

# @router.get("/me/export", response_model=UserResponse)
# async def export_my_data(current_user: UserResponse = Depends(get_current_active_user)):
#     logging.info(f"USER DATA EXPORT: {current_user.email}")
#     """
#     Export the current user's data.
#     """
#     return current_user
