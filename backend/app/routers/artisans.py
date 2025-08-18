# routers/artisans.py
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi import File, UploadFile, Form
from schemas.artisan_schemas import ArtisanSignup
from schemas.user_schemas import UserResponse
from auth_utils import get_password_hash, get_current_active_user
from database import fake_users_db, artisan_db
from typing import Optional
import re
import os

router = APIRouter()

@router.post("/signup/artisan", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Artisans"])
def artisan_signup(artisan: ArtisanSignup):
    # Sanitize & normalize inputs
    email = artisan.email.strip().lower()
    full_name = artisan.full_name.strip().title()
    phone = artisan.phone_number.strip()

    # 1. Check if email already exists
    if email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already exists")

    # 2. Check NIN format (11 digits)
    if not artisan.nin.isdigit() or not re.fullmatch(r"\d{11}", artisan.nin):
        raise HTTPException(status_code=400, detail="NIN must be exactly 11 digits")

    # 3. Validate strong password
    password = artisan.password
    if not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password) \
       or not re.search(r'[0-9]', password) or not re.search(r'[@$!%*?&]', password):
        raise HTTPException(status_code=400, detail="Password must contain uppercase, lowercase, number and special character")

    # 4. Hash the password
    hashed_password = get_password_hash(password)

    # 5. Create the artisan user
    user_id = len(fake_users_db) + 1
    new_artisan = {
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "phone_number": phone,
        "hashed_password": hashed_password,
        "role": "artisan",
        "service_category": artisan.service_category.strip(),
        "service_description": artisan.service_description.strip() if artisan.service_description else "",
        "years_of_experience": artisan.years_of_experience,
        "nin": artisan.nin,
        "verified": False,  #  Important for admin approval flow
        "email_verified": False
    }

    fake_users_db[email] = new_artisan

    return UserResponse(
        id=user_id,
        email=artisan.email,
        full_name=artisan.full_name,
        phone_number=artisan.phone_number,
        nin=artisan.nin,
        role="artisan",
        email_verified=False
    ) 

#  Artisan Document Upload Route 

UPLOAD_DIR = "uploads/artisans"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/artisan-documents", tags=["Artisans"])
def upload_documents(
    email: str = Form(...),
    id_card: UploadFile = File(...),
    portfolio: Optional[UploadFile] = File(None)
):
    if email not in fake_users_db:
        raise HTTPException(status_code=404, detail="Artisan not found")
    
    user = fake_users_db[email]
    if user["role"] != "artisan":
        raise HTTPException(status_code=400, detail="User is not an artisan")
    
     #  Save ID Card
    id_card_path = os.path.join(UPLOAD_DIR, f"{email}_id_card_{id_card.filename}")
    with open(id_card_path, "wb") as buffer:
        buffer.write(id_card.file.read())

    #  Save Portfolio (if uploaded)
    portfolio_path = None
    if portfolio:
        portfolio_path = os.path.join(UPLOAD_DIR, f"{email}_portfolio_{portfolio.filename}")
        with open(portfolio_path, "wb") as buffer:
            buffer.write(portfolio.file.read())

    # Simulate storing the uploaded files
    user["documents"] = {
        "id_card_filename": id_card.filename,
        "portfolio_filename": portfolio.filename if portfolio else None
    }

    return {
        "message": f"Documents uploaded for {user['full_name']}",
        "files": user["documents"]
    } 


@router.get("/documents/{email}", tags=["Artisans"])
def get_uploaded_documents(email: str, current_user: UserResponse = Depends(get_current_active_user)):
    # Check if artisan exists
    if email not in fake_users_db:
        raise HTTPException(status_code=404, detail="Artisan not found")
    
    user = fake_users_db[email]

    # Only allow the artisan themselves or an admin to view the document info
    if current_user.email != email and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view these documents")

    documents = user.get("documents")
    if not documents:
        raise HTTPException(status_code=404, detail="No documents uploaded yet")

    return {
        "artisan_email": email,
        "uploaded_files": documents
    }


# CRUD OPERATions created by Kayoode Johnnson
@router.get("/artisan")
async def get_all_artisan():
    return artisan_db

# Create artisan
@router.post("/artisan")
def create_artisan(artisan: ArtisanSignup):
    id = artisan.id = len(artisan_db) + 1
    details = artisan.model_dump()
    return {
        'Message' : "Artisan Created Successfully",
        "details" : details
    }

#Update artisan details
@router.patch("/artisan/{id}")
def update_artisan(id: uuid, artisan: artisan_signup):
    id = artisan.id
    if id not in artisan_db:
        raise HTTPException(status_code=404, detail="Artisan not found")
    details = artisan_db[id] = artisan.model_dump()
    return {
        'Message': "Artisan Updated Successfully",
        "artisan": details
    }

# Delete artisan
@router.delete("/artisan/{id}")
async def delete_artisan(id: uuid):
    if id not in artisan_db:
        raise HTTPException(status_code=404, detail="Artisan not found")
    del artisan_db[id]
    return {
        'Message': "Artisan Deleted Successfully"
    }

