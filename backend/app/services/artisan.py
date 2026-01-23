from fastapi import HTTPException
from database import Base, declarative_base, get_db
from models import UserT
from sqlalchemy.orm import Session
from schemas.artisan_schemas import ArtisanCreate, ArtisanUpdate,  ArtisanLogin
from services.auth_service import auth_services
import uuid
from uuid import UUID


class ArtisanService:
    @staticmethod
    def create_artisan(details: ArtisanCreate, db: Session):
        detail = db.query(UserT).filter(UserT.email  == details.email).first()
        if detail:
            raise HTTPException(detail="Email already registered", status_code=400)
        new_artisan = UserT(id=str(uuid.uuid4()), **details.model_dump(exclude={"password"}), password=auth_services.get_password_hash(details.password))
        db.add(new_artisan)
        db.commit()
        db.refresh(new_artisan)
        return new_artisan
    
    # this is an admin feature
    @staticmethod
    def get_artisan_by_email(email: str, db: Session):
        details = db.query(UserT).filter(UserT.email == email, UserT.role == "artisan").first()
        return details
    
    @staticmethod
    def get_all_artisans(db: Session):
        details = db.query(UserT).filter(UserT.role == "artisan").all()
        return details
    
    # admin feature
    @staticmethod
    def get_artisan_by_id(id: UUID, db: Session):
        details = db.query(UserT).filter(UserT.id == str(id), UserT.role == "artisan").first()
        return details
    
    @staticmethod
    def update_artisan(id: UUID, updates: ArtisanUpdate, db: Session):
        artisan = db.query(UserT).filter(UserT.id == str(id)) & (UserT.role == "artisan").first()
        if not artisan:
            raise Exception("Artisan not found")
        for key, value in updates.model_dump().items():
            if value is not None:
                setattr(artisan, key, value)
        db.commit()
        db.refresh(artisan)
        return artisan
    
    @staticmethod
    def delete_artisan(id: UUID, db: Session):
        artisan = db.query(UserT).filter(UserT.id == str(id), UserT.role == "artisan").first()
        if not artisan:
            raise Exception("Artisan not found")
        db.delete(artisan)
        db.commit()
        return {"detail": artisan.email, "message": "Artisan deleted successfully"}
    


artisan_services = ArtisanService()