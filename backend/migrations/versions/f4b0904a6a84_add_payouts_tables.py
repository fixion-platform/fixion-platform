"""add_payouts_tables

Revision ID: f4b0904a6a84
Revises: da8beaa87d38
Create Date: 2025-09-25 07:18:22.883815

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision: str = 'f4b0904a6a84'
down_revision: Union[str, Sequence[str], None] = 'da8beaa87d38'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        "payout_recipients",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", sa.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("provider", sa.String(length=32), nullable=False, server_default="paystack"),
        sa.Column("recipient_code", sa.String(length=64), nullable=False),
        sa.Column("bank_code", sa.String(length=16), nullable=False),
        sa.Column("bank_name", sa.String(length=128), nullable=False),
        sa.Column("account_last4", sa.String(length=4), nullable=False),
        sa.Column("account_name", sa.String(length=255), nullable=True),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="NGN"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_unique_constraint("uq_payout_recipient_user_provider", "payout_recipients", ["user_id", "provider"])
    op.create_index("ix_payout_recipient_active", "payout_recipients", ["active"], unique=False)

    op.create_table(
        "payouts",
        sa.Column("id", sa.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", sa.UUID(as_uuid=True), nullable=False, index=True),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="NGN"),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("reference", sa.String(length=64), nullable=False),
        sa.Column("transfer_code", sa.String(length=64), nullable=True),
        sa.Column("reason", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_unique_constraint("uq_payout_reference", "payouts", ["reference"])
    op.create_index("ix_payout_status", "payouts", ["status"], unique=False)
    op.create_index("ix_payout_created", "payouts", ["created_at"], unique=False)

def downgrade():
    op.drop_index("ix_payout_created", table_name="payouts")
    op.drop_index("ix_payout_status", table_name="payouts")
    op.drop_constraint("uq_payout_reference", "payouts", type_="unique")
    op.drop_table("payouts")

    op.drop_index("ix_payout_recipient_active", table_name="payout_recipients")
    op.drop_constraint("uq_payout_recipient_user_provider", "payout_recipients", type_="unique")
    op.drop_table("payout_recipients")
