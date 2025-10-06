"""widen phone_number & nin

Revision ID: 431c56978f8d
Revises: 65521aa4336b
Create Date: 2025-09-27 10:11:17.184418

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '431c56978f8d'
down_revision: Union[str, Sequence[str], None] = '65521aa4336b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    with op.batch_alter_table("users") as b:
        b.alter_column("phone_number", type_=sa.String(255))
        b.alter_column("nin", type_=sa.String(255))

def downgrade():
    with op.batch_alter_table("users") as b:
        b.alter_column("phone_number", type_=sa.String(32))
        b.alter_column("nin", type_=sa.String(20))