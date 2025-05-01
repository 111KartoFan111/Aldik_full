import React, { useState, useEffect } from 'react';
import './CourseModal.css';
import { useNavigate } from "react-router-dom";

// Иконки для сложности
import easyIcon from '../../assets/images/easy-icon.svg';
import mediumIcon from '../../assets/images/medium-icon.svg';
import hardIcon from '../../assets/images/hard-icon.svg';
import py from '../../assets/images/py.png';
import ml from '../../assets/images/ml.png';
import dta from '../../assets/images/dta.png';
import cppdev from '../../assets/images/cpp-dev.png';
import csharpdev from '../../assets/images/csharp-dev.png';
import deeplearning from '../../assets/images/deep-learning.png';
import algorithms from '../../assets/images/algorithms.png';
import reactnative from '../../assets/images/react-native.png';
import jsadvanced from '../../assets/images/js-advanced.png';
import machinelearning from '../../assets/images/machine-learning.png';
import computerarch from '../../assets/images/computer-arch.png';
import reactweb from '../../assets/images/react-web.jpeg';
import andrew from '../../assets/images/Andrew.png';
import erlan from '../../assets/images/Erlan.jpg';
import beka from '../../assets/images/beka.jpg';
import kian from '../../assets/images/kian.jpg';
import alex from '../../assets/images/alex.png';

// Данные курсов
const courses = [
  // Пример обновленной структуры курса с несколькими инструкторами
  {
    id: 3,
    title: 'Математика для ML',
    image: ml,
    provider: 'Imperial College London',
    difficulty: 'Hard',
    category: 'Искусственный интеллект',
    xp: 1500,
    description: 'Изучите математические основы машинного обучения, включая линейную алгебру, статистику и оптимизацию.',
    skills: ['Линейная алгебра', 'Статистика', 'Теория вероятностей', 'Математический анализ'],
    duration: '8 недель',
    languages: ['Python', 'R'],
    teacher: [
      { name: "Andrew Ng", avatar: andrew }
    ]
  },
  {
    id: 2,
    title: 'Профессиональная сертификация Google Data Analytics',
    image: dta,
    provider: 'Google',
    difficulty: 'Medium',
    category: 'Аналитика данных',
    xp: 950,
    description: 'Получите профессиональную сертификацию от Google и освойте инструменты анализа данных.',
    skills: ['SQL', 'R', 'Tableau', 'Big Query', 'Анализ данных'],
    duration: '6 месяцев',
    languages: ['Python', 'R', 'SQL'],
    teacher: [
      { name: "Kian Katanforoosh", avatar: kian }
    ]
  },
  {
    id: 1,
    title: 'Программирование для всех (начало работы с Python)',
    image: py,
    provider: 'University of Michigan',
    difficulty: 'Easy',
    category: 'Программирование',
    xp: 450,
    description: 'Идеальный курс для начинающих программистов. Изучите основы Python с нуля.',
    skills: ['Python', 'Базовые алгоритмы', 'Структуры данных', 'Работа с файлами'],
    duration: '4 недели',
    languages: ['Python'],
    teacher: [
      { name: "Алексей Коледачкин", avatar: alex }
    ]
  },
  {
    id: 4,
    title: 'Веб-разработка с React',
    image: reactweb,
    provider: 'Meta',
    difficulty: 'Medium',
    category: 'Веб-разработка',
    xp: 800,
    description: 'Создавайте современные интерфейсы с использованием библиотеки React.',
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Компонентный подход'],
    duration: '6 недель',
    languages: [ 'React'],
    teacher: [
      { name: "Ерлан Кадырович", avatar: erlan }
    ]
  },
  {
    id: 5,
    title: 'Архитектура компьютера',
    image: computerarch,
    provider: 'Stanford University',
    difficulty: 'Hard',
    category: 'Компьютерные науки',
    xp: 1200,
    description: 'Изучите принципы работы компьютерных систем, от транзисторов до высокоуровневой архитектуры.',
    skills: ['Цифровая логика', 'Ассемблер', 'Организация памяти', 'Процессоры'],
    duration: '10 недель',
    languages: ['C++',  'Ассемблер'],
    teacher: [
      { name: "Мубарак Бекзат", avatar: beka }
    ]
  },
  {
    id: 6,
    title: 'Машинное обучение',
    image: machinelearning,
    provider: 'Stanford University',
    difficulty: 'Medium',
    category: 'Искусственный интеллект',
    xp: 1000,
    description: 'Освойте ключевые алгоритмы машинного обучения и их практическое применение.',
    skills: ['Python', 'Scikit-learn', 'Регрессия', 'Классификация', 'Кластеризация'],
    duration: '8 недель',
    languages: ['Python', 'R']
  },
  // Добавим новые курсы
  {
    id: 7,
    title: 'Продвинутый JavaScript',
    image: jsadvanced,
    provider: 'University of Michigan',
    difficulty: 'Medium',
    category: 'Веб-разработка',
    xp: 750,
    description: 'Углубленное изучение JavaScript, асинхронного программирования и современных возможностей языка.',
    skills: ['JavaScript', 'ES6+', 'Асинхронность', 'Функциональное программирование'],
    duration: '7 недель',
    languages: ['JavaScript'],
    teacher: [
      { name: "Ерлан Кадырович", avatar: erlan }
    ]
  },
  {
    id: 8,
    title: 'React Native для мобильной разработки',
    image: reactnative,
    provider: 'Meta',
    difficulty: 'Medium',
    category: 'Мобильная разработка',
    xp: 850,
    description: 'Создавайте кроссплатформенные мобильные приложения с использованием React Native.',
    skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Expo'],
    duration: '8 недель',
    languages: ['React'],
    teacher: [
      { name: "Ерлан Кадырович", avatar: erlan }
    ]
  },
  {
    id: 9,
    title: 'Алгоритмы и структуры данных с Python',
    image: algorithms,
    provider: 'Princeton University',
    difficulty: 'Medium',
    category: 'Компьютерные науки',
    xp: 900,
    description: 'Изучите фундаментальные алгоритмы и структуры данных на языке Python.',
    skills: ['Python', 'Алгоритмы', 'Структуры данных', 'Анализ сложности'],
    duration: '6 недель',
    languages: ['Python']
  },
  {
    id: 10,
    title: 'Глубокое обучение',
    image: deeplearning,
    provider: 'DeepLearning.AI',
    difficulty: 'Hard',
    category: 'Искусственный интеллект',
    xp: 1300,
    description: 'Изучите теорию и практику нейронных сетей и глубокого обучения.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Нейронные сети', 'CNN', 'RNN'],
    duration: '12 недель',
    languages: ['Python']
  },
  {
    id: 11,
    title: 'Разработка с C#',
    image: csharpdev,
    provider: 'Microsoft',
    difficulty: 'Medium',
    category: 'Программирование',
    xp: 800,
    description: 'Освойте программирование на C# и создание приложений с .NET.',
    skills: ['C#', '.NET', 'ASP.NET', 'Объектно-ориентированное программирование'],
    duration: '10 недель',
    languages: ['C#']
  },
  {
    id: 12,
    title: 'Программирование на C++',
    image: cppdev,
    provider: 'Duke University',
    difficulty: 'Hard',
    category: 'Программирование',
    xp: 1100,
    description: 'Изучите язык C++ и его применение для системного программирования и высокопроизводительных вычислений.',
    skills: ['C++', 'STL', 'Многопоточность', 'Управление памятью'],
    duration: '11 недель',
    languages: ['C++'],
    teacher: [
      { name: "Мубарак Бекзат", avatar: beka }
    ]
  }
];

// Получение иконки сложности
const getDifficultyIcon = (difficulty) => {
  switch(difficulty) {
    case 'Easy': return easyIcon;
    case 'Medium': return mediumIcon;
    case 'Hard': return hardIcon;
    default: return easyIcon;
  }
};

// Получение цвета для сложности
const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'Easy': return 'green';
    case 'Medium': return 'orange';
    case 'Hard': return 'red';
    default: return 'green';
  }
};

const CourseModal = ({ isOpen, onClose, courseId = null, languageName = null, onViewAllClick = () => {} }) => {
  // Фильтруем курсы по языку, если указан язык
  const navigate = useNavigate();
  
  // Обновленная функция handleEnroll для перехода на страницу курса с выбранным языком программирования
  const handleEnroll = () => {
    if (selectedCourse) {
      onClose(); // Закрываем модалку
      
      // Получаем язык программирования из выбранного курса
      const programmingLanguage = selectedCourse.languages && selectedCourse.languages[0] ? 
        selectedCourse.languages[0].toLowerCase() : 'javascript';
      
      // Определяем соответствующий идентификатор языка для CoursePlayerPage
      let languageId;
      switch(programmingLanguage.toLowerCase()) {
        case 'python':
          languageId = 'python';
          break;
        case 'c#':
          languageId = 'csharp';
          break;
        case 'c++':
          languageId = 'cpp';
          break;
        case 'react':
          languageId = 'react';
          break;
        case 'html':
        case 'css':
          languageId = 'htmlcss';
          break;
        case 'javascript':
        default:
          languageId = 'javascript';
      }
      
      // Переходим на страницу курса с соответствующим языком
      // Используем формат URL, соответствующий маршруту в App.jsx
      navigate(`/course/${languageId}/lesson/1.1`);
    }
  };
  
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  useEffect(() => {
    if (languageName) {
      // Если указан язык, фильтруем курсы по нему
      const filtered = courses.filter(course => 
        course.languages && course.languages.some(lang => 
          lang.toLowerCase() === languageName.toLowerCase() ||
          (languageName === 'HTML & CSS' && (lang === 'HTML' || lang === 'CSS'))
        )
      );
      setFilteredCourses(filtered);
      
      // Устанавливаем первый курс из отфильтрованных как выбранный
      if (filtered.length > 0) {
        setSelectedCourse(filtered[0]);
      } else {
        setSelectedCourse(null);
      }
    } else if (courseId) {
      // Иначе показываем конкретный курс по ID
      const course = courses.find(course => course.id === courseId);
      if (course) {
        setSelectedCourse(course);
        setFilteredCourses([course]);
      } else {
        setSelectedCourse(null);
        setFilteredCourses([]);
      }
    }
  }, [courseId, languageName]);

  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null;

  return (
    <div className="course-modal-overlay" onClick={onClose}>
      <div className="course-modal language-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {languageName && (
          <div className="modal-language-header">
            <h2>{languageName} - Рекомендуемые курсы</h2>
          </div>
        )}
        
        {filteredCourses.length > 0 ? (
          <>
            <div className="language-courses-grid">
              {filteredCourses.slice(0, 3).map((course) => (
                <div 
                  key={course.id}
                  className={`language-course-card ${selectedCourse && selectedCourse.id === course.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="course-card-image-container">
                    <img src={course.image} alt={course.title} className="course-card-image" />
                  </div>
                  <div className="course-card-content">
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-provider">{course.provider}</p>
                    <div className="course-card-difficulty" style={{ color: getDifficultyColor(course.difficulty) }}>
                      <img src={getDifficultyIcon(course.difficulty)} alt={`${course.difficulty} difficulty`} className="difficulty-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedCourse && (
              <div className="course-modal-content">
                <div className="course-header">
                  <div className="course-image-container">
                    <img src={selectedCourse.image} alt={selectedCourse.title} className="course-image" />
                  </div>
                  
                  <div className="course-title-section">
                    <h2 className="course-title">{selectedCourse.title}</h2>
                    <p className="course-provider">{selectedCourse.provider}</p>
                    
                    <div className="course-difficulty" style={{ color: getDifficultyColor(selectedCourse.difficulty) }}>
                      <img src={getDifficultyIcon(selectedCourse.difficulty)} alt={`${selectedCourse.difficulty} difficulty`} className="difficulty-icon" />
                    </div>
                    
                    <div className="course-category">
                      <span>Категория:</span>
                      <span>{selectedCourse.category}</span>
                    </div>
                    
                    <div className="course-xp">
                      <span>За завершение:</span>
                      <span>{selectedCourse.xp} XP</span>
                    </div>
                  </div>
                </div>
                
                <div className='course-instructors'>
                  <h3>Инструкторы:</h3>
                  <div className="instructors-list">
                    {Array.isArray(selectedCourse.teacher) ? 
                      selectedCourse.teacher.map((teacher, index) => (
                        <div key={index} className="instructor-item">
                          <div className="instructor-avatar">
                            {teacher.avatar ? 
                              <img src={teacher.avatar} alt={teacher.name} /> :
                              <div className="avatar-placeholder">{teacher.name.charAt(0)}</div>
                            }
                          </div>
                          <span className="instructor-name">{teacher.name}</span>
                        </div>
                      )) : 
                      <div className="instructor-item">
                        <div className="instructor-avatar">
                          <div className="avatar-placeholder">
                            {selectedCourse.teacher ? selectedCourse.teacher.charAt(0) : "?"}
                          </div>
                        </div>
                        <span className="instructor-name">{selectedCourse.teacher || "Неизвестный инструктор"}</span>
                      </div>
                    }
                  </div>
                </div>
                
                <div className="course-details">
                  <div className="course-description">
                    <h3>Описание курса</h3>
                    <p>{selectedCourse.description}</p>
                  </div>
                  
                  <div className="course-skills">
                    <h3>Навыки, которые вы приобретете</h3>
                    <ul>
                      {selectedCourse.skills && selectedCourse.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="course-duration">
                    <h3>Продолжительность</h3>
                    <p>{selectedCourse.duration}</p>
                  </div>
                </div>
                
                <div className="course-actions">
                  <button className="enroll-button" onClick={handleEnroll}>Записаться на курс</button>
                  <button className="save-button">Сохранить на потом</button>
                </div>
              </div>
            )}
            
            {languageName && (
              <div className="view-all-courses">
                <button className="view-all-button" onClick={() => {
                  onClose();
                  setTimeout(() => onViewAllClick(), 300);
                }}>
                  Смотреть все курсы по {languageName}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-courses-message">
            <p>Курсы по {languageName ? languageName : "данной теме"} скоро появятся. Следите за обновлениями!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент для отображения карточек курсов в сетке
export const CourseGrid = ({ onCourseClick }) => {
  const navigate = useNavigate();
  
  const handleCourseClick = (course) => {
    // Получаем язык программирования из курса
    const programmingLanguage = course.languages && course.languages[0] ? 
      course.languages[0].toLowerCase() : 'javascript';
    
    // Определяем соответствующий идентификатор языка
    let languageId;
    switch(programmingLanguage.toLowerCase()) {
      case 'python':
        languageId = 'python';
        break;
      case 'c#':
        languageId = 'csharp';
        break;
      case 'c++':
        languageId = 'cpp';
        break;
      case 'react':
        languageId = 'react';
        break;
      case 'html':
      case 'css':
        languageId = 'htmlcss';
        break;
      case 'javascript':
      default:
        languageId = 'javascript';
    }
    
    // Переходим на страницу курса с соответствующим языком
    navigate(`/course/${languageId}/lesson/1.1`);
  };
  
  return (
    <div className="course-grid">
      {courses.map(course => (
        <div 
          key={course.id}
          className="course-card"
          onClick={() => onCourseClick(course.id)}
        >
          <div className="course-card-image-container">
            <img src={course.image} alt={course.title} className="course-card-image" />
          </div>
          <div className="course-card-content">
            <h3 className="course-card-title">{course.title}</h3>
            <p className="course-card-provider">{course.provider}</p>
            <div className="course-card-difficulty" style={{ color: getDifficultyColor(course.difficulty) }}>
              <img src={getDifficultyIcon(course.difficulty)} alt={`${course.difficulty} difficulty`} className="difficulty-icon" />
            </div>
            <div className="course-card-category">
              Категория: {course.category}
            </div>
            <div className="course-card-xp">
              За завершение: {course.xp} XP
            </div>
            <button className="learn-button" onClick={(e) => {
              e.stopPropagation();
              handleCourseClick(course);
            }}>Изучить Технику</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseModal;

