"""Добавляет столбец image_url в таблицу courses

Revision ID: 20250507_add_course_image
Revises: 20250505_add_avatar
Create Date: 2025-05-07 10:00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20250507_add_course_image'
down_revision = '20250505_add_avatar'
branch_labels = None
depends_on = None


def upgrade():
    # Добавляем столбец image_url в таблицу courses
    op.add_column('courses', sa.Column('image_url', sa.String(), nullable=True))
    
    # Обновляем существующие записи с URL-адресами изображений по умолчанию
    op.execute("""
    UPDATE courses SET image_url = 
        CASE 
            WHEN title LIKE '%JavaScript%' THEN '/static/images/courses/javascript.jpg'
            WHEN title LIKE '%Python%' THEN '/static/images/courses/python.jpg'
            WHEN title LIKE '%HTML%' THEN '/static/images/courses/html-css.jpg'
            WHEN title LIKE '%CSS%' THEN '/static/images/courses/html-css.jpg'
            WHEN title LIKE '%React%' THEN '/static/images/courses/react.jpg'
            WHEN title LIKE '%C++%' THEN '/static/images/courses/cpp.jpg'
            WHEN title LIKE '%C#%' THEN '/static/images/courses/csharp.jpg'
            ELSE '/static/images/courses/default.jpg'
        END
    """)
    
    print("Столбец image_url успешно добавлен в таблицу courses")


def downgrade():
    # Удаляем столбец image_url из таблицы courses
    op.drop_column('courses', 'image_url')
    
    print("Столбец image_url удален из таблицы courses")