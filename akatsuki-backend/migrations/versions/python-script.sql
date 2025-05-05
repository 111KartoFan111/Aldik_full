-- Скрипт для заполнения модулей и уроков для курса "Python для анализа данных"

-- Получаем ID курса, чтобы на него ссылаться
DO $$
DECLARE
    python_course_id INTEGER;
    module_id INTEGER;
    lesson_id INTEGER;
    question_id INTEGER;
BEGIN
    -- Получаем ID курса Python
    SELECT id INTO python_course_id FROM courses WHERE title = 'Python для анализа данных';

    -- Проверяем, что курс найден
    IF python_course_id IS NULL THEN
        RAISE EXCEPTION 'Курс "Python для анализа данных" не найден в базе данных';
    END IF;

    ----------------------------------------------------------------------------------
    -- Заполнение модулей и уроков для курса "Python для анализа данных"
    ----------------------------------------------------------------------------------
    
    -- Модуль 1: Основы Python
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (python_course_id, 'Основы Python', 'Изучение базовых концепций языка Python, переменных, типов данных и операторов', 1, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Основы Python"
    -- Урок 1.1: Введение в Python
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Введение в Python',
        'Что такое Python?',
        '<p>Python — это высокоуровневый язык программирования общего назначения. Он отличается читаемым кодом и философией, которая подчеркивает важность удобства программиста.</p><p>В этом уроке вы познакомитесь с основами Python и его применением в различных областях.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Введение в Python и его основные концепции.',
        '<p>Создайте свой первый скрипт с выводом сообщения.</p>',
        '# Ваш первый Python код\nprint("Привет, мир!")\n\n# Попробуйте вывести еще одно сообщение\n',
        1,
        25,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Введение в Python"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Python - это язык программирования...', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Низкого уровня', FALSE, 1),
        (question_id, 'Высокого уровня', TRUE, 2),
        (question_id, 'Среднего уровня', FALSE, 3),
        (question_id, 'Машинный язык', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'В чём основное преимущество Python?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Высокая скорость выполнения', FALSE, 1),
        (question_id, 'Низкое потребление памяти', FALSE, 2),
        (question_id, 'Читаемость кода и простота синтаксиса', TRUE, 3),
        (question_id, 'Компиляция в машинный код', FALSE, 4);
    
    -- Урок 1.2: Переменные и типы данных
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Переменные и типы данных',
        'Работа с переменными в Python',
        '<p>Переменные в Python не требуют явного объявления типа данных.</p><p>В этом уроке мы рассмотрим основные типы данных в Python и работу с ними.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение работы с переменными и типами данных в Python.',
        '<p>Создайте переменные разных типов и выполните операции с ними.</p>',
        '# Целое число\nage = 25\n\n# Строка\nname = "Алиса"\n\n# Число с плавающей точкой\nprice = 9.99\n\n# Вывод значений\nprint(age)\nprint(name)\nprint(price)\n\n# Создайте список и словарь\n',
        2,
        30,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Переменные и типы данных"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой оператор используется для присваивания в Python?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '==', FALSE, 1),
        (question_id, ':=', FALSE, 2),
        (question_id, '=', TRUE, 3),
        (question_id, '=>', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тип данных представляет список в Python?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'array', FALSE, 1),
        (question_id, 'list', TRUE, 2),
        (question_id, 'tuple', FALSE, 3),
        (question_id, 'set', FALSE, 4);
    
    -- Модуль 2: Структуры данных и алгоритмы
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (python_course_id, 'Структуры данных и алгоритмы', 'Изучение списков, кортежей, словарей и алгоритмов обработки данных', 2, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Структуры данных и алгоритмы"
    -- Урок 2.1: Списки и кортежи
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Списки и кортежи',
        'Работа со списками и кортежами',
        '<p>Списки и кортежи - важные структуры данных в Python.</p><p>В этом уроке мы рассмотрим их особенности и методы работы с ними.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение работы со списками и кортежами в Python.',
        '<p>Создайте списки и кортежи, выполните основные операции с ними.</p>',
        '# Создание списка\nmy_list = [1, 2, 3, 4, 5]\n\n# Создание кортежа\nmy_tuple = (10, 20, 30)\n\n# Операции со списком\nmy_list.append(6)  # Добавление элемента\nprint(my_list)\n\n# Попробуйте другие операции\n',
        1,
        35,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Списки и кортежи"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Чем отличается список от кортежа в Python?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Списки быстрее кортежей', FALSE, 1),
        (question_id, 'Списки могут изменяться, кортежи - нет', TRUE, 2),
        (question_id, 'Кортежи могут содержать только числа', FALSE, 3),
        (question_id, 'Списки могут содержать только элементы одного типа', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой метод используется для добавления элемента в список?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'insert()', FALSE, 1),
        (question_id, 'add()', FALSE, 2),
        (question_id, 'append()', TRUE, 3),
        (question_id, 'push()', FALSE, 4);
    
    -- Урок 2.2: Словари и множества
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Словари и множества',
        'Работа со словарями и множествами',
        '<p>Словари и множества - мощные структуры данных для хранения и обработки уникальных значений.</p><p>В этом уроке мы рассмотрим особенности и методы работы с ними.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение работы со словарями и множествами в Python.',
        '<p>Создайте словари и множества, выполните основные операции с ними.</p>',
        '# Создание словаря\nstudent = {\n    "name": "Иван",\n    "age": 20,\n    "courses": ["Математика", "Информатика"]\n}\n\n# Доступ к элементам словаря\nprint(student["name"])\n\n# Изменение значения\nstudent["age"] = 21\nprint(student)\n\n# Создание множества\nmy_set = {1, 2, 3, 4, 5}\nprint(my_set)\n\n# Добавление элемента в множество\nmy_set.add(6)\nprint(my_set)\n\n# Операции с множествами\n# Создайте еще одно множество и попробуйте операции объединения, пересечения и разности\n',
        2,
        35,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Словари и множества"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какая структура данных используется для хранения пар ключ-значение?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Список', FALSE, 1),
        (question_id, 'Словарь', TRUE, 2),
        (question_id, 'Кортеж', FALSE, 3),
        (question_id, 'Множество', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какое свойство характерно для элементов множества?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Элементы упорядочены', FALSE, 1),
        (question_id, 'Элементы могут повторяться', FALSE, 2),
        (question_id, 'Элементы уникальны', TRUE, 3),
        (question_id, 'Элементы индексируются', FALSE, 4);
        
    -- Модуль 3: Анализ данных с Pandas и NumPy
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (python_course_id, 'Анализ данных с Pandas и NumPy', 'Изучение библиотек Pandas и NumPy для обработки и анализа данных', 3, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Анализ данных с Pandas и NumPy"
    -- Урок 3.1: Введение в NumPy
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Введение в NumPy',
        'Основы работы с NumPy',
        '<p>NumPy - это библиотека для научных вычислений в Python, которая предоставляет мощный объект массива.</p><p>В этом уроке мы познакомимся с основами NumPy и научимся работать с массивами.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Введение в библиотеку NumPy и работа с многомерными массивами.',
        '<p>Создайте массивы NumPy и выполните основные операции.</p>',
        '# Импорт библиотеки NumPy\nimport numpy as np\n\n# Создание одномерного массива\narr1 = np.array([1, 2, 3, 4, 5])\nprint(arr1)\n\n# Создание двумерного массива\narr2 = np.array([[1, 2, 3], [4, 5, 6]])\nprint(arr2)\n\n# Основные атрибуты массива\nprint("Форма массива:", arr2.shape)\nprint("Размерность:", arr2.ndim)\nprint("Тип данных:", arr2.dtype)\n\n# Математические операции с массивами\n# Попробуйте некоторые операции, например сложение массивов или умножение на число\n',
        1,
        40,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Введение в NumPy"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тип данных является основным в NumPy?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Список', FALSE, 1),
        (question_id, 'Массив', TRUE, 2),
        (question_id, 'Словарь', FALSE, 3),
        (question_id, 'DataFrame', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какое преимущество имеют массивы NumPy перед обычными списками Python?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Поддержка больших размеров данных', FALSE, 1),
        (question_id, 'Простота использования', FALSE, 2),
        (question_id, 'Эффективность вычислений с большими массивами данных', TRUE, 3),
        (question_id, 'Более гибкая структура', FALSE, 4);
        
    -- Урок 3.2: Введение в Pandas
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Введение в Pandas',
        'Библиотека Pandas для анализа данных',
        '<p>Pandas - мощная библиотека для анализа и манипуляции данными.</p><p>В этом уроке вы познакомитесь с основными структурами данных Pandas: Series и DataFrame.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Введение в библиотеку Pandas и её основные структуры данных.',
        '<p>Создайте DataFrame и выполните базовые операции с ним.</p>',
        '# Импорт библиотеки\nimport pandas as pd\nimport numpy as np\n\n# Создание Series\ns = pd.Series([1, 3, 5, np.nan, 6, 8])\nprint(s)\n\n# Создание DataFrame\ndata = {\n    "Name": ["Алиса", "Боб", "Чарли"],\n    "Age": [25, 30, 35],\n    "City": ["Москва", "Санкт-Петербург", "Казань"]\n}\n\ndf = pd.DataFrame(data)\n\n# Вывод данных\nprint(df)\n\n# Базовые операции с DataFrame\nprint("\\nБазовая информация о DataFrame:")\nprint(df.info())\n\n# Статистика по числовым столбцам\nprint("\\nСтатистика:")\nprint(df.describe())\n\n# Доступ к столбцу\nprint("\\nСтолбец Age:")\nprint(df["Age"])\n\n# Фильтрация данных\n# Попробуйте выбрать строки, где Age > 25\n',
        2,
        45,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Введение в Pandas"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Что такое DataFrame в Pandas?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Функция для форматирования данных', FALSE, 1),
        (question_id, 'Двумерная структура данных, похожая на таблицу', TRUE, 2),
        (question_id, 'Способ визуализации данных', FALSE, 3),
        (question_id, 'Метод для работы с базами данных', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой метод используется для чтения CSV-файла в Pandas?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'read_csv()', TRUE, 1),
        (question_id, 'load_csv()', FALSE, 2),
        (question_id, 'import_csv()', FALSE, 3),
        (question_id, 'csv_read()', FALSE, 4);
        
    -- Урок 3.3: Визуализация данных
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Визуализация данных',
        'Создание графиков и диаграмм',
        '<p>Визуализация данных - важная часть анализа данных, которая помогает лучше понять закономерности и тенденции.</p><p>В этом уроке мы рассмотрим базовые техники визуализации с использованием Matplotlib и Seaborn.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Обзор библиотек визуализации данных и создание графиков.',
        '<p>Создайте различные типы визуализаций с использованием предоставленных данных.</p>',
        '# Импорт необходимых библиотек\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Создание данных для визуализации\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\n\n# Создание простого графика\nplt.figure(figsize=(10, 6))\nplt.plot(x, y, "b-", linewidth=2)\nplt.title("Синусоида")\nplt.xlabel("x")\nplt.ylabel("sin(x)")\nplt.grid(True)\nplt.show()\n\n# Создание DataFrame с данными\ndf = pd.DataFrame({\n    "x": range(1, 11),\n    "y1": np.random.randn(10),\n    "y2": np.random.randn(10) + 5,\n    "y3": np.random.randn(10) - 5\n})\n\n# Попробуйте создать столбчатую диаграмму\n',
        3,
        50,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Визуализация данных"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какая библиотека является основной для визуализации данных в Python?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'NumPy', FALSE, 1),
        (question_id, 'Pandas', FALSE, 2),
        (question_id, 'Matplotlib', TRUE, 3),
        (question_id, 'SciPy', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тип графика лучше всего подходит для отображения распределения непрерывной величины?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Линейный график', FALSE, 1),
        (question_id, 'Столбчатая диаграмма', FALSE, 2),
        (question_id, 'Гистограмма', TRUE, 3),
        (question_id, 'Круговая диаграмма', FALSE, 4);

    RAISE NOTICE 'Курс "Python для анализа данных" успешно заполнен данными';

END $;