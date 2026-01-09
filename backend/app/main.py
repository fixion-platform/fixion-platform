
# main.py

from fastapi import FastAPI
# from routers import users, artisans, admin
from routers.users import user_router

app = FastAPI(
    title="Fixion API",
    description="Backend service for the Fixion Artisan and Customer Marketplace.",
    version="1.0.0",
)

# Include the routers
# app.include_router(authentication.router)
# app.include_router(users)
# app.include_router(artisans.router)
# app.include_router(admin.router)

include_router = app.include_router(user_router)

# Root route - a simple welcome message to test if API is working
@app.get("/", tags=["Root"])
def read_root():
    """A welcome message to confirm the API is running."""
    return {"message": "Welcome to the Fixion API!"}

