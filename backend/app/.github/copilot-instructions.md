# Fixion Backend API - AI Coding Agent Instructions

## Architecture Overview

**Fixion** is a FastAPI-based marketplace backend connecting artisans and customers. The architecture follows a layered pattern:

- **Routers** (`routers/`): API endpoints organized by resource (users, artisans, admin)
- **Services** (`services/`): Business logic layer (auth, user operations, admin functions)
- **Models** (`models.py`): SQLAlchemy ORM models for database entities
- **Schemas** (`schemas/`): Pydantic validation models for request/response serialization
- **Database**: PostgreSQL via `database.py` with Alembic migrations

## Key Project Patterns

### Authentication Flow
- **OAuth2 Password Bearer** token-based authentication in `services/auth_service.py`
- JWT tokens created with `create_access_token()` containing email and user ID
- All protected endpoints require `get_current_user` dependency injection
- Password hashing uses bcrypt via passlib `CryptContext`

### Model Structure
Three core entity models exist:
- `UserT`: Customers with location (longitude/latitude) and role field
- `ArtisanT`: Extends customer model with years_of_experience, NIN, and is_verified flag
- `AdminT`: FK reference to UserT for admin users
- `ArtisanServiceT`: Links artisans to service categories

**Important**: All entities use UUID string primary keys generated with `uuid.uuid4()`

### Schema Validation Pattern
Pydantic schemas in `schemas/user_schemas.py` use:
- `@validator` decorators for custom field validation (password strength, whitespace stripping)
- `Field()` with descriptions for OpenAPI docs
- Inheritance hierarchy: `UserBase` → `UserCreate`/`UserResponse`/`UserLogin`
- `.from_orm()` for converting SQLAlchemy models to response schemas

### Database Session Pattern
All route endpoints use:
```python
db: Session = Depends(get_db)
```
Sessions are yielded from `database.get_db()` and auto-closed in finally block.

## File Organization & Conventions

| Directory | Purpose |
|-----------|---------|
| `routers/` | API endpoint handlers; each resource has own router module |
| `services/` | Reusable business logic; instantiate as singleton (`auth_services = AuthService()`) |
| `schemas/` | Pydantic models per resource (auth, user, artisan) |
| `models.py` | All SQLAlchemy ORM model definitions |
| `alembic/versions/` | Migration files; run with `alembic upgrade head` |

## Development Workflow

### Database Migrations
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```
Migrations are auto-generated from model changes; stored in `alembic/versions/`.

### Running the API
```bash
uvicorn main:app --reload
```
FastAPI server starts at `http://localhost:8000`; auto-reload enabled in dev.

### Testing Structure
Tests in `tests/` parallel router structure (`test_users.py`, `test_auth.py`).

## Critical Implementation Details

1. **UUID Generation**: Use `str(uuid.uuid4())` when creating new entities—this converts UUID to string for database storage
2. **Password Hashing**: Always hash with `auth_services.get_password_hash()`, never store plaintext
3. **Email Uniqueness**: Enforce unique constraint on email field; check before user creation with `db.query(UserT).filter(UserT.email == user.email).first()`
4. **Token Expiry**: Default 30 minutes; configured in `.env` and passed to `create_access_token()`
5. **Environment Variables**: Loaded via `dotenv.load_dotenv()` in `database.py` and `config.py`; requires `.env` file with `POSTGRESQL_DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`

## Common Tasks

**Add new endpoint**: Create router method in `routers/`, use `db: Session = Depends(get_db)`, depend on `auth_services.get_current_user` for auth.

**Add new model**: Define in `models.py` with SQLAlchemy columns; run `alembic revision --autogenerate` to create migration.

**Create service method**: Add static method to service class, inject `db: Session`, return result or raise `HTTPException`.

**Validate request**: Create Pydantic schema in `schemas/`, use `@validator` for custom rules, import in route handler.
