"""add_avatar_url_to_users

Revision ID: 20250505_add_avatar
Revises: 20250504_unique_course_title
Create Date: 2025-05-05 10:00:00

"""
from alembic import op
import sqlalchemy as sa

revision = '20250505_add_avatar'
down_revision = '20250504_unique_course_title'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('avatar_url', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'avatar_url')