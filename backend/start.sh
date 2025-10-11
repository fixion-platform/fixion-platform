#!/usr/bin/env bash

#  Fixion Backend Startup Script (Railway)
#  Runs DB migrations automatically, then boots FastAPI


set -e  # stop if any command fails

echo "Starting Fixion backend initialization..."
echo "--------------------------------------------"

# Step 1: Run Alembic migrations to ensure all tables exist
echo "Running database migrations..."
alembic upgrade head

# Step 2: Start the FastAPI server with Uvicorn
echo "Migrations complete. Launching API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
