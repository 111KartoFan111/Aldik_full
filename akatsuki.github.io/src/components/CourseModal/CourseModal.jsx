import React, { useState, useEffect } from 'react';
import './CourseModal.css';
import { useNavigate } from "react-router-dom";
import { coursesAPI } from '../../services/api';

// Иконки для сложности
import easyIcon from '../../assets/images/easy-icon.svg';
import mediumIcon from '../../assets/images/medium-icon.svg';
import hardIcon from '../../assets/images/hard-icon.svg';

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
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех курсов при монтировании компонента
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await coursesAPI.getAllCourses();
        setCourses(response.data); // Предполагаем, что данные приходят в response.data
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить курсы. Попробуйте позже.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Фильтрация курсов по языку или ID
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
  }, [courseId, languageName, courses]);

  // Функция для записи на курс
  const handleEnroll = async () => {
    if (selectedCourse) {
      try {
        await coursesAPI.enrollInCourse(selectedCourse.id);
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
        navigate(`/course/${languageId}/lesson/1.1`);
      } catch (err) {
        console.error('Error enrolling in course:', err);
        setError('Не удалось записаться на курс. Попробуйте позже.');
      }
    }
  };

  // Если модальное окно закрыто, не рендерим его содержимое
  if (!isOpen) return null;

  return (
    <div className="course-modal-overlay" onClick={onClose}>
      <div className="course-modal language-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {loading && (
          <div className="loading-message">
            <p>Загрузка курсов...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && languageName && (
          <div className="modal-language-header">
            <h2>{languageName} - Рекомендуемые курсы</h2>
          </div>
        )}
        
        {!loading && !error && filteredCourses.length > 0 ? (
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
        ) : !loading && !error && (
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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка всех курсов при монтировании компонента
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await coursesAPI.getAllCourses();
        setCourses(response.data); // Предполагаем, что данные приходят в response.data
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить курсы. Попробуйте позже.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = async (course) => {
    try {
      await coursesAPI.enrollInCourse(course.id);
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
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Не удалось записаться на курс. Попробуйте позже.');
    }
  };

  return (
    <div className="course-grid">
      {loading && (
        <div className="loading-message">
          <p>Загрузка курсов...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && courses.map(course => (
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