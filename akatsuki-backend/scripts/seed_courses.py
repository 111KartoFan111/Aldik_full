"""
Скрипт для создания тестовых курсов в базе данных.
Запускать из корневой директории проекта:
python -m scripts.seed_courses
"""
import os
import sys
from datetime import datetime, timedelta
import random

# Добавляем корневую директорию проекта в sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.auth.models import User
from app.courses.models import Course, Module, Lesson, TestQuestion, TestOption

def seed_courses():
    db = next(get_db())
    
    try:
        print("Создание курсов...")
        
        # Создаем языковые курсы
        courses_data = [
            {
                "title": "JavaScript: от основ до продвинутого уровня",
                "description": "Полный курс по JavaScript, который научит вас основам языка, работе с DOM, асинхронному программированию и современным фреймворкам.",
                "duration": 240,
                "xp_reward": 500
            },
            {
                "title": "Python для анализа данных",
                "description": "Изучите Python для работы с данными, включая библиотеки pandas, NumPy и базовые алгоритмы машинного обучения.",
                "duration": 180,
                "xp_reward": 450
            },
            {
                "title": "HTML и CSS: интерактивные веб-сайты",
                "description": "Научитесь создавать красивые и отзывчивые веб-сайты с помощью HTML5 и CSS3.",
                "duration": 120,
                "xp_reward": 350
            },
            {
                "title": "React: разработка современных интерфейсов",
                "description": "Освойте популярную библиотеку React для создания быстрых и масштабируемых пользовательских интерфейсов.",
                "duration": 200,
                "xp_reward": 480
            },
            {
                "title": "C++: программирование игр и приложений",
                "description": "Изучите C++ для разработки высокопроизводительных приложений, игр и системных программ.",
                "duration": 250,
                "xp_reward": 550
            },
            {
                "title": "C#: разработка на платформе .NET",
                "description": "Освойте C# для создания Windows-приложений, игр на Unity и веб-приложений ASP.NET.",
                "duration": 220,
                "xp_reward": 500
            }
        ]
        
        created_courses = []
        for course_data in courses_data:
            existing_course = db.query(Course).filter(Course.title == course_data["title"]).first()
            if not existing_course:
                print(f"Создание курса: {course_data['title']}...")
                course = Course(**course_data)
                db.add(course)
                db.commit()
                db.refresh(course)
                created_courses.append(course)
                print(f"Создан курс с ID: {course.id}")
            else:
                created_courses.append(existing_course)
                print(f"Курс {existing_course.title} уже существует с ID: {existing_course.id}")
        
        # Добавляем модули и уроки для JavaScript курса
        js_course = next((c for c in created_courses if "JavaScript" in c.title), None)
        if js_course:
            print(f"Создание модулей для курса: {js_course.title}...")
            
            # Проверяем, есть ли уже модули
            existing_modules = db.query(Module).filter(Module.course_id == js_course.id).count()
            if existing_modules == 0:
                # Модуль 1: Основы JavaScript
                module1 = Module(
                    course_id=js_course.id,
                    title="Основы JavaScript",
                    description="Синтаксис языка, переменные, типы данных и операторы",
                    order=1
                )
                db.add(module1)
                db.commit()
                db.refresh(module1)
                
                # Уроки для модуля 1
                lessons1 = [
                    {
                        "title": "Введение в JavaScript",
                        "intro_title": "Что такое JavaScript?",
                        "intro_content": "<p>JavaScript — это мультипарадигменный язык программирования. Поддерживает объектно-ориентированный, императивный и функциональный стили. Является реализацией спецификации ECMAScript.</p><p>В этом уроке вы узнаете об основных понятиях JavaScript и его применении в веб-разработке.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Введение в JavaScript и его основные концепции.",
                        "practice_instructions": "<p>Создайте свой первый скрипт с выводом сообщения в консоль.</p>",
                        "practice_code_template": "// Ваш первый JavaScript код\nconsole.log('Привет, мир!');\n\n// Попробуйте вывести еще одно сообщение\n",
                        "order": 1,
                        "xp_reward": 25
                    },
                    {
                        "title": "Переменные и типы данных",
                        "intro_title": "Работа с переменными",
                        "intro_content": "<p>Переменные в JavaScript объявляются с помощью ключевых слов <code>let</code>, <code>const</code> и <code>var</code>.</p><p>В этом уроке мы разберемся с отличиями между ними и рассмотрим основные типы данных.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы с переменными и типами данных в JavaScript.",
                        "practice_instructions": "<p>Объявите переменные разных типов и выведите их значения в консоль.</p>",
                        "practice_code_template": "// Объявление переменных\nlet name = 'Джон';\nconst age = 25;\n\n// Вывод значений в консоль\nconsole.log(name);\nconsole.log(age);\n\n// Создайте и выведите другие типы данных\n",
                        "order": 2,
                        "xp_reward": 30
                    }
                ]
                
                for lesson_data in lessons1:
                    lesson = Lesson(module_id=module1.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = []
                    if "Введение" in lesson.title:
                        questions = [
                            {
                                "question": "Для чего используется JavaScript?",
                                "order": 1,
                                "options": [
                                    {"text": "Только для серверной разработки", "is_correct": False, "order": 1},
                                    {"text": "Для создания интерактивных веб-страниц", "is_correct": True, "order": 2},
                                    {"text": "Только для мобильной разработки", "is_correct": False, "order": 3},
                                    {"text": "Только для работы с базами данных", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой тег используется для добавления JavaScript в HTML?",
                                "order": 2,
                                "options": [
                                    {"text": "<javascript>", "is_correct": False, "order": 1},
                                    {"text": "<script>", "is_correct": True, "order": 2},
                                    {"text": "<js>", "is_correct": False, "order": 3},
                                    {"text": "<code>", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    elif "Переменные" in lesson.title:
                        questions = [
                            {
                                "question": "Какое ключевое слово используется для объявления неизменяемой переменной?",
                                "order": 1,
                                "options": [
                                    {"text": "let", "is_correct": False, "order": 1},
                                    {"text": "var", "is_correct": False, "order": 2},
                                    {"text": "const", "is_correct": True, "order": 3},
                                    {"text": "def", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой тип данных представляет число в JavaScript?",
                                "order": 2,
                                "options": [
                                    {"text": "String", "is_correct": False, "order": 1},
                                    {"text": "Integer", "is_correct": False, "order": 2},
                                    {"text": "Number", "is_correct": True, "order": 3},
                                    {"text": "Float", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                # Модуль 2: Функции и объекты
                module2 = Module(
                    course_id=js_course.id,
                    title="Функции и объекты",
                    description="Работа с функциями, объектами и массивами в JavaScript",
                    order=2
                )
                db.add(module2)
                db.commit()
                db.refresh(module2)
                
                # Уроки для модуля 2
                lessons2 = [
                    {
                        "title": "Функции в JavaScript",
                        "intro_title": "Работа с функциями",
                        "intro_content": "<p>Функции в JavaScript являются блоками кода, которые можно вызвать с указанными аргументами.</p><p>В этом уроке вы узнаете о различных способах определения функций и их использовании.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение функций в JavaScript, включая стрелочные функции и замыкания.",
                        "practice_instructions": "<p>Создайте несколько функций и вызовите их с разными параметрами.</p>",
                        "practice_code_template": "// Объявление функции\nfunction greet(name) {\n  return 'Привет, ' + name + '!';\n}\n\n// Вызов функции\nconsole.log(greet('Мир'));\n\n// Создайте еще одну функцию и вызовите ее\n",
                        "order": 1,
                        "xp_reward": 35
                    },
                    {
                        "title": "Объекты и массивы",
                        "intro_title": "Структуры данных в JavaScript",
                        "intro_content": "<p>Объекты и массивы являются основными структурами данных в JavaScript.</p><p>В этом уроке мы рассмотрим, как создавать и использовать эти структуры данных.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы с объектами и массивами в JavaScript.",
                        "practice_instructions": "<p>Создайте объект и массив, и выполните базовые операции с ними.</p>",
                        "practice_code_template": "// Создание объекта\nconst person = {\n  name: 'Джон',\n  age: 30,\n  city: 'Нью-Йорк'\n};\n\n// Вывод свойств объекта\nconsole.log(person.name);\n\n// Создание массива\nconst fruits = ['яблоко', 'банан', 'апельсин'];\n\n// Вывод элементов массива\nconsole.log(fruits[0]);\n\n// Добавьте новые свойства объекту и элементы в массив\n",
                        "order": 2,
                        "xp_reward": 40
                    }
                ]
                
                for lesson_data in lessons2:
                    lesson = Lesson(module_id=module2.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = []
                    if "Функции" in lesson.title:
                        questions = [
                            {
                                "question": "Как определить стрелочную функцию в JavaScript?",
                                "order": 1,
                                "options": [
                                    {"text": "function() => {}", "is_correct": False, "order": 1},
                                    {"text": "() -> {}", "is_correct": False, "order": 2},
                                    {"text": "() => {}", "is_correct": True, "order": 3},
                                    {"text": "=> () {}", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Что такое замыкание в JavaScript?",
                                "order": 2,
                                "options": [
                                    {"text": "Синтаксис для определения функции", "is_correct": False, "order": 1},
                                    {"text": "Функция внутри другой функции", "is_correct": False, "order": 2},
                                    {"text": "Функция, которая запоминает своё лексическое окружение", "is_correct": True, "order": 3},
                                    {"text": "Средство для закрытия веб-страницы", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    elif "Объекты" in lesson.title:
                        questions = [
                            {
                                "question": "Как получить доступ к свойству объекта?",
                                "order": 1,
                                "options": [
                                    {"text": "object->property", "is_correct": False, "order": 1},
                                    {"text": "object.property или object['property']", "is_correct": True, "order": 2},
                                    {"text": "object::property", "is_correct": False, "order": 3},
                                    {"text": "object(property)", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой метод используется для добавления элемента в конец массива?",
                                "order": 2,
                                "options": [
                                    {"text": "pop()", "is_correct": False, "order": 1},
                                    {"text": "add()", "is_correct": False, "order": 2},
                                    {"text": "push()", "is_correct": True, "order": 3},
                                    {"text": "append()", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                db.commit()
                print(f"Модули и уроки для {js_course.title} успешно созданы!")
            else:
                print(f"Модули для курса {js_course.title} уже существуют!")
        
        # Добавляем модули и уроки для Python курса
        python_course = next((c for c in created_courses if "Python" in c.title), None)
        if python_course:
            print(f"Создание модулей для курса: {python_course.title}...")
            
            # Проверяем, есть ли уже модули
            existing_modules = db.query(Module).filter(Module.course_id == python_course.id).count()
            if existing_modules == 0:
                # Модуль 1: Основы Python
                module1 = Module(
                    course_id=python_course.id,
                    title="Основы Python",
                    description="Синтаксис языка, переменные, типы данных и структуры управления",
                    order=1
                )
                db.add(module1)
                db.commit()
                db.refresh(module1)
                
                # Модуль 2: Структуры данных в Python
                module2 = Module(
                    course_id=python_course.id,
                    title="Структуры данных и алгоритмы",
                    description="Изучение основных структур данных и алгоритмов в Python",
                    order=2
                )
                db.add(module2)
                db.commit()
                db.refresh(module2)
                
                # Модуль 3: Работа с данными
                module3 = Module(
                    course_id=python_course.id,
                    title="Анализ данных с Pandas и NumPy",
                    description="Основы работы с библиотеками для анализа данных",
                    order=3
                )
                db.add(module3)
                db.commit()
                db.refresh(module3)
                
                # Уроки для модуля 1
                lessons1 = [
                    {
                        "title": "Введение в Python",
                        "intro_title": "Что такое Python?",
                        "intro_content": "<p>Python — это высокоуровневый язык программирования общего назначения. Он отличается читаемым кодом и философией, которая подчеркивает важность удобства программиста.</p><p>В этом уроке вы познакомитесь с основами Python и его применением в различных областях.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Введение в Python и его основные концепции.",
                        "practice_instructions": "<p>Создайте свой первый скрипт с выводом сообщения.</p>",
                        "practice_code_template": "# Ваш первый Python код\nprint('Привет, мир!')\n\n# Попробуйте вывести еще одно сообщение\n",
                        "order": 1,
                        "xp_reward": 25
                    },
                    {
                        "title": "Переменные и типы данных",
                        "intro_title": "Работа с переменными в Python",
                        "intro_content": "<p>Переменные в Python не требуют явного объявления типа данных.</p><p>В этом уроке мы рассмотрим основные типы данных в Python и работу с ними.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы с переменными и типами данных в Python.",
                        "practice_instructions": "<p>Создайте переменные разных типов и выполните операции с ними.</p>",
                        "practice_code_template": "# Целое число\nage = 25\n\n# Строка\nname = 'Алиса'\n\n# Число с плавающей точкой\nprice = 9.99\n\n# Вывод значений\nprint(age)\nprint(name)\nprint(price)\n\n# Создайте список и словарь\n",
                        "order": 2,
                        "xp_reward": 30
                    }
                ]
                
                for lesson_data in lessons1:
                    lesson = Lesson(module_id=module1.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = []
                    if "Введение" in lesson.title:
                        questions = [
                            {
                                "question": "Python - это язык программирования...",
                                "order": 1,
                                "options": [
                                    {"text": "Низкого уровня", "is_correct": False, "order": 1},
                                    {"text": "Высокого уровня", "is_correct": True, "order": 2},
                                    {"text": "Среднего уровня", "is_correct": False, "order": 3},
                                    {"text": "Машинный язык", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "В чём основное преимущество Python?",
                                "order": 2,
                                "options": [
                                    {"text": "Высокая скорость выполнения", "is_correct": False, "order": 1},
                                    {"text": "Низкое потребление памяти", "is_correct": False, "order": 2},
                                    {"text": "Читаемость кода и простота синтаксиса", "is_correct": True, "order": 3},
                                    {"text": "Компиляция в машинный код", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    elif "Переменные" in lesson.title:
                        questions = [
                            {
                                "question": "Какой оператор используется для присваивания в Python?",
                                "order": 1,
                                "options": [
                                    {"text": "==", "is_correct": False, "order": 1},
                                    {"text": ":=", "is_correct": False, "order": 2},
                                    {"text": "=", "is_correct": True, "order": 3},
                                    {"text": "=>", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой тип данных представляет список в Python?",
                                "order": 2,
                                "options": [
                                    {"text": "array", "is_correct": False, "order": 1},
                                    {"text": "list", "is_correct": True, "order": 2},
                                    {"text": "tuple", "is_correct": False, "order": 3},
                                    {"text": "set", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                # Уроки для модуля 2 и 3 (добавим по одному уроку для примера)
                lessons2 = [
                    {
                        "title": "Списки и кортежи",
                        "intro_title": "Работа со списками и кортежами",
                        "intro_content": "<p>Списки и кортежи - важные структуры данных в Python.</p><p>В этом уроке мы рассмотрим их особенности и методы работы с ними.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы со списками и кортежами в Python.",
                        "practice_instructions": "<p>Создайте списки и кортежи, выполните основные операции с ними.</p>",
                        "practice_code_template": "# Создание списка\nmy_list = [1, 2, 3, 4, 5]\n\n# Создание кортежа\nmy_tuple = (10, 20, 30)\n\n# Операции со списком\nmy_list.append(6)  # Добавление элемента\nprint(my_list)\n\n# Попробуйте другие операции\n",
                        "order": 1,
                        "xp_reward": 35
                    }
                ]
                
                lessons3 = [
                    {
                        "title": "Введение в Pandas",
                        "intro_title": "Библиотека Pandas для анализа данных",
                        "intro_content": "<p>Pandas - мощная библиотека для анализа и манипуляции данными.</p><p>В этом уроке вы познакомитесь с основными структурами данных Pandas: Series и DataFrame.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Введение в библиотеку Pandas и её основные структуры данных.",
                        "practice_instructions": "<p>Создайте DataFrame и выполните базовые операции с ним.</p>",
                        "practice_code_template": "# Импорт библиотеки\nimport pandas as pd\n\n# Создание DataFrame\ndata = {\n    'Name': ['Алиса', 'Боб', 'Чарли'],\n    'Age': [25, 30, 35],\n    'City': ['Москва', 'Санкт-Петербург', 'Казань']\n}\n\ndf = pd.DataFrame(data)\n\n# Вывод данных\nprint(df)\n\n# Попробуйте выполнить другие операции с DataFrame\n",
                        "order": 1,
                        "xp_reward": 40
                    }
                ]
                
                # Добавляем уроки для модуля 2
                for lesson_data in lessons2:
                    lesson = Lesson(module_id=module2.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = [
                        {
                            "question": "Чем отличается список от кортежа в Python?",
                            "order": 1,
                            "options": [
                                {"text": "Списки быстрее кортежей", "is_correct": False, "order": 1},
                                {"text": "Списки могут изменяться, кортежи - нет", "is_correct": True, "order": 2},
                                {"text": "Кортежи могут содержать только числа", "is_correct": False, "order": 3},
                                {"text": "Списки могут содержать только элементы одного типа", "is_correct": False, "order": 4}
                            ]
                        },
                        {
                            "question": "Какой метод используется для добавления элемента в список?",
                            "order": 2,
                            "options": [
                                {"text": "insert()", "is_correct": False, "order": 1},
                                {"text": "add()", "is_correct": False, "order": 2},
                                {"text": "append()", "is_correct": True, "order": 3},
                                {"text": "push()", "is_correct": False, "order": 4}
                            ]
                        }
                    ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                # Добавляем уроки для модуля 3
                for lesson_data in lessons3:
                    lesson = Lesson(module_id=module3.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = [
                        {
                            "question": "Что такое DataFrame в Pandas?",
                            "order": 1,
                            "options": [
                                {"text": "Функция для форматирования данных", "is_correct": False, "order": 1},
                                {"text": "Двумерная структура данных, похожая на таблицу", "is_correct": True, "order": 2},
                                {"text": "Способ визуализации данных", "is_correct": False, "order": 3},
                                {"text": "Метод для работы с базами данных", "is_correct": False, "order": 4}
                            ]
                        },
                        {
                            "question": "Какой метод используется для чтения CSV-файла в Pandas?",
                            "order": 2,
                            "options": [
                                {"text": "read_csv()", "is_correct": True, "order": 1},
                                {"text": "load_csv()", "is_correct": False, "order": 2},
                                {"text": "import_csv()", "is_correct": False, "order": 3},
                                {"text": "csv_read()", "is_correct": False, "order": 4}
                            ]
                        }
                    ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                db.commit()
                print(f"Модули и уроки для {python_course.title} успешно созданы!")
            else:
                print(f"Модули для курса {python_course.title} уже существуют!")
        
        # Аналогично для HTML/CSS курса
        html_course = next((c for c in created_courses if "HTML" in c.title), None)
        if html_course:
            print(f"Создание модулей для курса: {html_course.title}...")
            
            # Проверяем, есть ли уже модули
            existing_modules = db.query(Module).filter(Module.course_id == html_course.id).count()
            if existing_modules == 0:
                # Модуль 1: Основы HTML
                module1 = Module(
                    course_id=html_course.id,
                    title="Основы HTML",
                    description="Изучение базовой структуры HTML-документа и основных тегов",
                    order=1
                )
                db.add(module1)
                db.commit()
                db.refresh(module1)
                
                # Модуль 2: Основы CSS
                module2 = Module(
                    course_id=html_course.id,
                    title="Основы CSS",
                    description="Изучение основ каскадных таблиц стилей для оформления веб-страниц",
                    order=2
                )
                db.add(module2)
                db.commit()
                db.refresh(module2)
                
                # Уроки для модуля 1
                lessons1 = [
                    {
                        "title": "Введение в HTML",
                        "intro_title": "Что такое HTML?",
                        "intro_content": "<p>HTML (HyperText Markup Language) — это стандартизированный язык разметки документов для создания веб-страниц.</p><p>В этом уроке вы узнаете о базовой структуре HTML-документа и его роли в веб-разработке.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Введение в HTML и его основные концепции.",
                        "practice_instructions": "<p>Создайте простую HTML-страницу с базовой структурой.</p>",
                        "practice_code_template": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Моя первая страница</title>\n</head>\n<body>\n  <!-- Добавьте содержимое здесь -->\n  \n</body>\n</html>",
                        "order": 1,
                        "xp_reward": 25
                    },
                    {
                        "title": "Текст и списки в HTML",
                        "intro_title": "Работа с текстом в HTML",
                        "intro_content": "<p>HTML предоставляет множество тегов для форматирования текста и создания списков.</p><p>В этом уроке мы рассмотрим основные теги для работы с текстом и создания списков.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы с текстом и списками в HTML.",
                        "practice_instructions": "<p>Создайте HTML-страницу с различными текстовыми элементами и списками.</p>",
                        "practice_code_template": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Текст и списки</title>\n</head>\n<body>\n  <h1>Заголовок первого уровня</h1>\n  <p>Параграф текста.</p>\n  \n  <!-- Создайте маркированный список -->\n  \n  <!-- Создайте нумерованный список -->\n  \n</body>\n</html>",
                        "order": 2,
                        "xp_reward": 30
                    }
                ]
                
                for lesson_data in lessons1:
                    lesson = Lesson(module_id=module1.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = []
                    if "Введение" in lesson.title:
                        questions = [
                            {
                                "question": "Что означает аббревиатура HTML?",
                                "order": 1,
                                "options": [
                                    {"text": "Hyper Text Markup Language", "is_correct": True, "order": 1},
                                    {"text": "High Tech Modern Language", "is_correct": False, "order": 2},
                                    {"text": "Hyperlink Text Management Language", "is_correct": False, "order": 3},
                                    {"text": "Home Tool Markup Language", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой тег определяет тело HTML-документа?",
                                "order": 2,
                                "options": [
                                    {"text": "<doc>", "is_correct": False, "order": 1},
                                    {"text": "<body>", "is_correct": True, "order": 2},
                                    {"text": "<html>", "is_correct": False, "order": 3},
                                    {"text": "<content>", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    elif "Текст" in lesson.title:
                        questions = [
                            {
                                "question": "Какой тег используется для создания абзаца?",
                                "order": 1,
                                "options": [
                                    {"text": "<paragraph>", "is_correct": False, "order": 1},
                                    {"text": "<p>", "is_correct": True, "order": 2},
                                    {"text": "<text>", "is_correct": False, "order": 3},
                                    {"text": "<a>", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой тег используется для создания маркированного списка?",
                                "order": 2,
                                "options": [
                                    {"text": "<list>", "is_correct": False, "order": 1},
                                    {"text": "<ul>", "is_correct": True, "order": 2},
                                    {"text": "<ol>", "is_correct": False, "order": 3},
                                    {"text": "<ml>", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                # Уроки для модуля CSS
                lessons2 = [
                    {
                        "title": "Введение в CSS",
                        "intro_title": "Что такое CSS?",
                        "intro_content": "<p>CSS (Cascading Style Sheets) — это язык стилей, который используется для описания внешнего вида документа, написанного на HTML.</p><p>В этом уроке вы познакомитесь с основами CSS и различными способами его подключения к HTML-документу.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Введение в CSS и его основные концепции.",
                        "practice_instructions": "<p>Создайте CSS-стили для вашей HTML-страницы.</p>",
                        "practice_code_template": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Введение в CSS</title>\n  <style>\n    /* Добавьте стили здесь */\n    body {\n      font-family: Arial, sans-serif;\n    }\n    \n    h1 {\n      color: blue;\n    }\n  </style>\n</head>\n<body>\n  <h1>Заголовок с CSS-стилями</h1>\n  <p>Параграф текста.</p>\n</body>\n</html>",
                        "order": 1,
                        "xp_reward": 30
                    },
                    {
                        "title": "Селекторы CSS",
                        "intro_title": "Использование селекторов в CSS",
                        "intro_content": "<p>Селекторы CSS позволяют выбирать элементы HTML для применения стилей.</p><p>В этом уроке мы рассмотрим различные типы селекторов и их применение.</p>",
                        "video_url": "https://www.youtube.com/embed/ix9cRaBkVe0",
                        "video_description": "Подробное объяснение работы с селекторами в CSS.",
                        "practice_instructions": "<p>Используйте различные селекторы для стилизации HTML-страницы.</p>",
                        "practice_code_template": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Селекторы CSS</title>\n  <style>\n    /* Селектор тега */\n    p {\n      font-size: 16px;\n    }\n    \n    /* Селектор класса */\n    .highlight {\n      background-color: yellow;\n    }\n    \n    /* Селектор ID */\n    #header {\n      text-align: center;\n    }\n    \n    /* Добавьте другие селекторы */\n    \n  </style>\n</head>\n<body>\n  <h1 id=\"header\">Заголовок страницы</h1>\n  <p>Обычный параграф текста.</p>\n  <p class=\"highlight\">Параграф с выделением.</p>\n  \n  <!-- Добавьте другие элементы для стилизации -->\n  \n</body>\n</html>",
                        "order": 2,
                        "xp_reward": 35
                    }
                ]
                
                for lesson_data in lessons2:
                    lesson = Lesson(module_id=module2.id, **lesson_data)
                    db.add(lesson)
                    db.commit()
                    db.refresh(lesson)
                    
                    # Добавляем тестовые вопросы для урока
                    questions = []
                    if "Введение" in lesson.title:
                        questions = [
                            {
                                "question": "Что такое CSS?",
                                "order": 1,
                                "options": [
                                    {"text": "Computer Style Sheets", "is_correct": False, "order": 1},
                                    {"text": "Cascading Style Sheets", "is_correct": True, "order": 2},
                                    {"text": "Creative Style System", "is_correct": False, "order": 3},
                                    {"text": "Colorful Style Sheets", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какие существуют способы подключения CSS к HTML-документу?",
                                "order": 2,
                                "options": [
                                    {"text": "Только через внешний файл", "is_correct": False, "order": 1},
                                    {"text": "Встроенные, внутренние и внешние", "is_correct": True, "order": 2},
                                    {"text": "Только через тег <css>", "is_correct": False, "order": 3},
                                    {"text": "Только через атрибут class", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    elif "Селекторы" in lesson.title:
                        questions = [
                            {
                                "question": "Какой селектор используется для выбора элемента по ID?",
                                "order": 1,
                                "options": [
                                    {"text": ".id", "is_correct": False, "order": 1},
                                    {"text": "#", "is_correct": True, "order": 2},
                                    {"text": "@", "is_correct": False, "order": 3},
                                    {"text": "$", "is_correct": False, "order": 4}
                                ]
                            },
                            {
                                "question": "Какой селектор используется для выбора элемента по классу?",
                                "order": 2,
                                "options": [
                                    {"text": ".", "is_correct": True, "order": 1},
                                    {"text": "#", "is_correct": False, "order": 2},
                                    {"text": "class=", "is_correct": False, "order": 3},
                                    {"text": "@", "is_correct": False, "order": 4}
                                ]
                            }
                        ]
                    
                    for q_data in questions:
                        options_data = q_data.pop("options")
                        question = TestQuestion(lesson_id=lesson.id, **q_data)
                        db.add(question)
                        db.commit()
                        db.refresh(question)
                        
                        for opt_data in options_data:
                            option = TestOption(question_id=question.id, **opt_data)
                            db.add(option)
                
                db.commit()
                print(f"Модули и уроки для {html_course.title} успешно созданы!")
            else:
                print(f"Модули для курса {html_course.title} уже существуют!")

        print("Все курсы, модули и уроки успешно созданы!")

    except Exception as e:
        print(f"Ошибка при создании курсов: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_courses()