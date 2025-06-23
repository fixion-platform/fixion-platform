#  Fixion Backend (FastAPI)

Backend codebase for Fixion using FastAPI and PostgreSQL.

##  Folder Structure
- `app/main.py`: Entry point
- `app/database.py`: DB connection
- `app/models/`: SQLAlchemy models
- `app/routers/`: Routes like auth, booking, etc.
- `app/schemas/`: Pydantic schemas
- `app/services/`: Business logic
- `app/utils/`: Helpers like JWT

## Setup Instructions
1. Clone the repo
2. Create a virtual environment
3. Run `pip install -r requirements.txt`
4. Copy `.env.example` to `.env`
5. Start server: `uvicorn app.main:app --reload`

