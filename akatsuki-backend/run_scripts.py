import os
from sqlalchemy import create_engine, text
from app.config import settings  # Импортируем настройки из вашего проекта

# Создаем подключение к БД
engine = create_engine(settings.DATABASE_URL)

# Функция для выполнения скрипта
def execute_sql_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        sql_script = file.read()
    
    with engine.connect() as conn:
        conn.execute(text(sql_script))
        conn.commit()
        print(f"Скрипт {file_path} успешно выполнен")

# Запуск скриптов
execute_sql_file("migrations/versions/python-script.sql")
execute_sql_file("migrations/versions/html-css-script.sql")