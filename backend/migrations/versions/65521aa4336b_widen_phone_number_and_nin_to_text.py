"""widen phone_number and nin to TEXT

Revision ID: 65521aa4336b
Revises: f4b0904a6a84
Create Date: 2025-09-26 21:43:12.805920

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '65521aa4336b'
down_revision: Union[str, Sequence[str], None] = 'f4b0904a6a84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # PostgreSQL: alter type to TEXT (safe, no data loss)
    op.alter_column("users", "phone_number", type_=sa.Text(), existing_type=sa.String(length=32), existing_nullable=True)
    op.alter_column("users", "nin",          type_=sa.Text(), existing_type=sa.String(length=32), existing_nullable=True)

def downgrade():
    # Rollback: shrink to VARCHAR(32) (will fail if data is longer)
    op.alter_column("users", "phone_number", type_=sa.String(length=32), existing_type=sa.Text(), existing_nullable=True)
    op.alter_column("users", "nin",          type_=sa.String(length=32), existing_type=sa.Text(), existing_nullable=True)
