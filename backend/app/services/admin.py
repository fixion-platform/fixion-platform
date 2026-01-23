from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import UserT
from database import get_db

class AdminService:
    @staticmethod
    def get_all_users(db: Session):
        details = db.query(UserT).filter(UserT.role == "user").all()
        return details
    
    @staticmethod
    def get_user_by_id(id: str, db: Session):
        details = db.query(UserT).filter(UserT.id == id).first()
        return details
    
    @staticmethod
    def get_all_admins(db: Session):
        details = db.query(UserT).filter(UserT.role == "admin").all()
        return details
    
    @staticmethod
    def all(db: Session):
        details = db.query(UserT).all()
        return details
    
    @staticmethod 
    def delete_user(user_id: str,  db: Session):
        user = AdminService.get_user_by_id(user_id, db)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        db.delete(user)
        db.commit()
        return { "detail" : user.email,
            "message": "User deleted successfully"}
    
    
    
adminServices = AdminService()

        