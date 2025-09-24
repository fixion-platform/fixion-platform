
# main.py

from fastapi import FastAPI
from app.routers import authentication, users, artisans, admin

app = FastAPI(
    title="Fixion API",
    description="Backend service for the Fixion Artisan and Customer Marketplace.",
    version="1.0.0",
)

# Include the routers
app.include_router(authentication.router)
app.include_router(users.router)
app.include_router(artisans.router)
app.include_router(admin.router)

# Root route - a simple welcome message to test if API is working
@app.get("/", tags=["Root"])
def read_root():
    """A welcome message to confirm the API is running."""
    return {"message": "Welcome to the Fixion API!"}

