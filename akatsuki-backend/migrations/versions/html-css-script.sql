-- Скрипт для заполнения модулей и уроков для курса "HTML и CSS для начинающих"

-- Получаем ID курса, чтобы на него ссылаться
DO $$
DECLARE
    html_css_course_id INTEGER;
    module_id INTEGER;
    lesson_id INTEGER;
    question_id INTEGER;
BEGIN
    -- Получаем ID курса HTML и CSS
    SELECT id INTO html_css_course_id FROM courses WHERE title = 'HTML и CSS для начинающих';

    -- Проверяем, что курс найден
    IF html_css_course_id IS NULL THEN
        RAISE EXCEPTION 'Курс "HTML и CSS для начинающих" не найден в базе данных';
    END IF;

    ----------------------------------------------------------------------------------
    -- Заполнение модулей и уроков для курса "HTML и CSS для начинающих"
    ----------------------------------------------------------------------------------
    
    -- Модуль 1: Основы HTML
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (html_css_course_id, 'Основы HTML', 'Изучение базовой структуры HTML-документа и основных тегов', 1, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Основы HTML"
    -- Урок 1.1: Введение в HTML
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Введение в HTML',
        'Что такое HTML?',
        '<p>HTML (HyperText Markup Language) — это стандартизированный язык разметки документов для создания веб-страниц.</p><p>В этом уроке вы узнаете о базовой структуре HTML-документа и его роли в веб-разработке.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Введение в HTML и его основные концепции.',
        '<p>Создайте простую HTML-страницу с базовой структурой.</p>',
        '<!DOCTYPE html>\n<html>\n<head>\n  <title>Моя первая страница</title>\n</head>\n<body>\n  <!-- Добавьте содержимое здесь -->\n  \n</body>\n</html>',
        1,
        25,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Введение в HTML"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Что означает аббревиатура HTML?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Hyper Text Markup Language', TRUE, 1),
        (question_id, 'High Tech Modern Language', FALSE, 2),
        (question_id, 'Hyperlink Text Management Language', FALSE, 3),
        (question_id, 'Home Tool Markup Language', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тег определяет тело HTML-документа?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '<doc>', FALSE, 1),
        (question_id, '<body>', TRUE, 2),
        (question_id, '<html>', FALSE, 3),
        (question_id, '<content>', FALSE, 4);
        
    -- Урок 1.2: Текст и списки в HTML
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Текст и списки в HTML',
        'Работа с текстом в HTML',
        '<p>HTML предоставляет множество тегов для форматирования текста и создания списков.</p><p>В этом уроке мы рассмотрим основные теги для работы с текстом и создания списков.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение работы с текстом и списками в HTML.',
        '<p>Создайте HTML-страницу с различными текстовыми элементами и списками.</p>',
        '<!DOCTYPE html>\n<html>\n<head>\n  <title>Текст и списки</title>\n</head>\n<body>\n  <h1>Заголовок первого уровня</h1>\n  <p>Параграф текста.</p>\n  \n  <!-- Создайте маркированный список -->\n  \n  <!-- Создайте нумерованный список -->\n  \n</body>\n</html>',
        2,
        30,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Текст и списки в HTML"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тег используется для создания абзаца?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '<paragraph>', FALSE, 1),
        (question_id, '<p>', TRUE, 2),
        (question_id, '<text>', FALSE, 3),
        (question_id, '<a>', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой тег используется для создания маркированного списка?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '<list>', FALSE, 1),
        (question_id, '<ul>', TRUE, 2),
        (question_id, '<ol>', FALSE, 3),
        (question_id, '<ml>', FALSE, 4);
    
    -- Модуль 2: Основы CSS
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (html_css_course_id, 'Основы CSS', 'Изучение основ каскадных таблиц стилей для оформления веб-страниц', 2, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Основы CSS"
    -- Урок 2.1: Введение в CSS
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Введение в CSS',
        'Что такое CSS?',
        '<p>CSS (Cascading Style Sheets) — это язык стилей, который используется для описания внешнего вида документа, написанного на HTML.</p><p>В этом уроке вы познакомитесь с основами CSS и различными способами его подключения к HTML-документу.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Введение в CSS и его основные концепции.',
        '<p>Создайте CSS-стили для вашей HTML-страницы.</p>',
        '<!DOCTYPE html>\n<html>\n<head>\n  <title>Введение в CSS</title>\n  <style>\n    /* Добавьте стили здесь */\n    body {\n      font-family: Arial, sans-serif;\n    }\n    \n    h1 {\n      color: blue;\n    }\n  </style>\n</head>\n<body>\n  <h1>Заголовок с CSS-стилями</h1>\n  <p>Параграф текста.</p>\n</body>\n</html>',
        1,
        30,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Введение в CSS"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Что такое CSS?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Computer Style Sheets', FALSE, 1),
        (question_id, 'Cascading Style Sheets', TRUE, 2),
        (question_id, 'Creative Style System', FALSE, 3),
        (question_id, 'Colorful Style Sheets', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какие существуют способы подключения CSS к HTML-документу?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Только через внешний файл', FALSE, 1),
        (question_id, 'Встроенные, внутренние и внешние', TRUE, 2),
        (question_id, 'Только через тег <css>', FALSE, 3),
        (question_id, 'Только через атрибут class', FALSE, 4);
    
    -- Урок 2.2: Селекторы CSS
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Селекторы CSS',
        'Использование селекторов в CSS',
        '<p>Селекторы CSS позволяют выбирать элементы HTML для применения стилей.</p><p>В этом уроке мы рассмотрим различные типы селекторов и их применение.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение работы с селекторами в CSS.',
        '<p>Используйте различные селекторы для стилизации HTML-страницы.</p>',
        '<!DOCTYPE html>\n<html>\n<head>\n  <title>Селекторы CSS</title>\n  <style>\n    /* Селектор тега */\n    p {\n      font-size: 16px;\n    }\n    \n    /* Селектор класса */\n    .highlight {\n      background-color: yellow;\n    }\n    \n    /* Селектор ID */\n    #header {\n      text-align: center;\n    }\n    \n    /* Добавьте другие селекторы */\n    \n  </style>\n</head>\n<body>\n  <h1 id="header">Заголовок страницы</h1>\n  <p>Обычный параграф текста.</p>\n  <p class="highlight">Параграф с выделением.</p>\n  \n  <!-- Добавьте другие элементы для стилизации -->\n  \n</body>\n</html>',
        2,
        35,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Селекторы CSS"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой селектор используется для выбора элемента по ID?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '.id', FALSE, 1),
        (question_id, '#', TRUE, 2),
        (question_id, '@', FALSE, 3),
        (question_id, '$', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой селектор используется для выбора элемента по классу?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '.', TRUE, 1),
        (question_id, '#', FALSE, 2),
        (question_id, 'class=', FALSE, 3),
        (question_id, '@', FALSE, 4);
    
    -- Модуль 3: Создание адаптивных веб-страниц
    INSERT INTO modules (course_id, title, description, order, created_at)
    VALUES (html_css_course_id, 'Адаптивный веб-дизайн', 'Создание веб-страниц, которые хорошо выглядят на разных устройствах', 3, NOW())
    RETURNING id INTO module_id;
    
    -- Уроки для модуля "Адаптивный веб-дизайн"
    -- Урок 3.1: Медиа-запросы
    INSERT INTO lessons (module_id, title, intro_title, intro_content, video_url, video_description, 
                      practice_instructions, practice_code_template, order, xp_reward, created_at)
    VALUES (
        module_id,
        'Медиа-запросы',
        'Основы адаптивного дизайна',
        '<p>Медиа-запросы позволяют применять различные стили в зависимости от характеристик устройства.</p><p>В этом уроке вы научитесь создавать адаптивные веб-страницы, которые хорошо выглядят на разных устройствах.</p>',
        'https://www.youtube.com/embed/ix9cRaBkVe0',
        'Подробное объяснение медиа-запросов и адаптивного дизайна.',
        '<p>Создайте адаптивную веб-страницу с использованием медиа-запросов.</p>',
        '<!DOCTYPE html>\n<html>\n<head>\n  <title>Адаптивный дизайн</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n    body {\n      font-family: Arial, sans-serif;\n      margin: 0;\n      padding: 0;\n    }\n    \n    .container {\n      width: 80%;\n      margin: 0 auto;\n    }\n    \n    /* Медиа-запрос для устройств с шириной экрана до 768px */\n    @media (max-width: 768px) {\n      .container {\n        width: 95%;\n      }\n      \n      /* Добавьте свои стили для мобильных устройств */\n      \n    }\n    \n    /* Добавьте еще медиа-запросы */\n    \n  </style>\n</head>\n<body>\n  <div class="container">\n    <h1>Адаптивный дизайн</h1>\n    <p>Измените размер окна браузера, чтобы увидеть, как меняется дизайн.</p>\n    \n    <!-- Создайте адаптивный контент -->\n    \n  </div>\n</body>\n</html>',
        1,
        40,
        NOW()
    )
    RETURNING id INTO lesson_id;
    
    -- Тестовые вопросы для урока "Медиа-запросы"
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Для чего используются медиа-запросы?', 1, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, 'Для воспроизведения медиа-файлов', FALSE, 1),
        (question_id, 'Для применения разных стилей на разных устройствах', TRUE, 2),
        (question_id, 'Для запроса данных из медиа-ресурсов', FALSE, 3),
        (question_id, 'Для улучшения SEO', FALSE, 4);
    
    INSERT INTO test_questions (lesson_id, question, order, created_at)
    VALUES (lesson_id, 'Какой метатег важен для адаптивного дизайна?', 2, NOW())
    RETURNING id INTO question_id;
    
    -- Варианты ответов
    INSERT INTO test_options (question_id, text, is_correct, order)
    VALUES 
        (question_id, '<meta charset="UTF-8">', FALSE, 1),
        (question_id, '<meta name="viewport" content="width=device-width, initial-scale=1.0">', TRUE, 2),
        (question_id, '<meta name="description">', FALSE, 3),
        (question_id, '<meta http-equiv="refresh">', FALSE, 4);

    RAISE NOTICE 'Курс "HTML и CSS для начинающих" успешно заполнен данными';

END $$;