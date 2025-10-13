# migrations/env.py
from __future__ import annotations
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# --- Alembic Config object (reads alembic.ini) ---
config = context.config

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Ensure project root on sys.path so `app` is importable
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import metadata AFTER sys.path change
from app.db.database import Base  # noqa: E402
from app.models import *          # noqa: F401,F403,E402

target_metadata = Base.metadata

def _db_url() -> str:
    # Prefer env var; fall back to alembic.ini main option if present
    url = os.getenv("DATABASE_URL") or os.getenv("DB_URL")
    if not url:
        try:
            # Safe: get_main_option only reads the raw string; we won't pass it to get_section
            url = config.get_main_option("sqlalchemy.url")
        except Exception:
            url = None
    if not url:
        raise RuntimeError(
            "No database URL found. Set DATABASE_URL/DB_URL or put a literal URL in alembic.ini."
        )
    return url

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = _db_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    url = _db_url()
    # IMPORTANT: Avoid config.get_section(...). Build the config dict ourselves
    engine_cfg = {"sqlalchemy.url": url}
    connectable = engine_from_config(
        engine_cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
