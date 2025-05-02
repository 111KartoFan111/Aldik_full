import React, { useState, useEffect } from "react"; 
import cerflogo from "../../assets/images/akat.png";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Award,
  XCircle,
  Check,
  Menu,
  X,
  Download
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from "../Header/Header";
import "./CoursePlayerPage.css";
import { coursesAPI, profileAPI, authAPI } from "../../services/api";

const CoursePlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // State для интерактивных элементов
  const [activeSection, setActiveSection] = useState("intro");
  const [currentStep, setCurrentStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [xp, setXp] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(500);
  const [codeValue, setCodeValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false);
  
  // State для API данных
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [totalSteps, setTotalSteps] = useState(5);
  
  // State для пользовательского профиля и сертификата
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // New state for all courses
  
  // State для комментариев и реакций
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  
  // Parsing the lessonId format (e.g., "1.1" => module 1, lesson 1)
  const parseLessonIdFormat = (id) => {
    if (!id) return { moduleIndex: 0, lessonIndex: 0 };
    const parts = id.split('.');
    if (parts.length === 2) {
      return {
        moduleIndex: parseInt(parts[0]) - 1,
        lessonIndex: parseInt(parts[1]) - 1
      };
    }
    return { moduleIndex: 0, lessonIndex: 0 };
  };
  
  // Получение информации о текущем пользователе
  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUserData(response.data);
      setXp(response.data.xp || 0);
      const userRank = getRank(response.data.xp);
      setXpToNextLevel(getMaxXP(userRank));
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Ошибка при загрузке данных пользователя");
    }
  };
  
  // Функция для получения ранга на основе XP
  const getRank = (xp) => {
    if (xp < 500) return "Генин";
    if (xp < 1500) return "Чуунин";
    if (xp < 3000) return "Джонин";
    return "Каге";
  };
  
  // Функция для получения максимального XP для текущего ранга
  const getMaxXP = (rank) => {
    switch(rank) {
      case "Генин": return 500;
      case "Чуунин": return 1500;
      case "Джонин": return 3000;
      case "Каге": return 5000;
      default: return 1000;
    }
  };

  // Load course content from API
  const loadCourseData = async () => {
    setIsLoading(true);
    try {
      // Fetch course data
      const courseResponse = await coursesAPI.getCourseById(courseId);
      if (!courseResponse.data) {
        throw new Error(`Course data for ${courseId} not found`);
      }
      
      setCurrentCourse({
        id: courseId,
        title: courseResponse.data.title,
        modules: courseResponse.data.modules
      });
      setCourseModules(courseResponse.data.modules || []);
      
      // Fetch lesson data
      const lessonResponse = await coursesAPI.getLesson(lessonId);
      if (!lessonResponse.data) {
        throw new Error(`Lesson ${lessonId} not found`);
      }
      
      setCurrentLesson({
        ...lessonResponse.data,
        progress: lessonResponse.data.progress || {
          intro_completed: false,
          video_completed: false,
          practice_completed: false,
          test_completed: false,
          test_score: 0,
          earned_xp: 0,
          completed: false
        }
      });
      
      // Set initial code value if available
      if (lessonResponse.data.practice?.codeTemplate) {
        setCodeValue(lessonResponse.data.practice.codeTemplate);
      }
      
      // Initialize test answers
      if (lessonResponse.data.test?.length > 0) {
        const initialAnswers = {};
        lessonResponse.data.test.forEach(question => {
          initialAnswers[`question${question.id}`] = "";
        });
        setTestAnswers(initialAnswers);
      }
      
      // Fetch user data
      await fetchUserData();
      
      // Fetch comments
      const commentsResponse = await coursesAPI.getLessonComments(lessonId);
      setComments(commentsResponse.data || []);
      
      // Fetch all courses for course selector and recommendations
      const allCoursesResponse = await coursesAPI.getAllCourses();
      setAllCourses(allCoursesResponse.data || []);
      
    } catch (error) {
      console.error("Error loading course data:", error);
      setError(`Ошибка при загрузке данных курса: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    loadCourseData();
  }, [courseId, lessonId]);
  
  // Получение фото пользователя при активации раздела сертификата
  useEffect(() => {
    if (activeSection === "cert") {
      setUserPhoto("/api/placeholder/150/150");
    }
  }, [activeSection]);
  
  // Отслеживание и обновление прогресса пользователя
  const updateUserProgress = async (progressData) => {
    try {
      const response = await coursesAPI.updateLessonProgress(courseId, lessonId, progressData);
      
      setCurrentLesson(prevLesson => {
        const newProgress = { ...prevLesson.progress };
        
        if (progressData.section === "intro" && progressData.completed) {
          newProgress.intro_completed = true;
          newProgress.earned_xp += progressData.xp || 10;
        }
        
        if (progressData.section === "video" && progressData.completed) {
          newProgress.video_completed = true;
          newProgress.earned_xp += progressData.xp || 15;
        }
        
        if (progressData.section === "practice" && progressData.completed) {
          newProgress.practice_completed = true;
          newProgress.earned_xp += progressData.xp || 25;
        }
        
        if (progressData.section === "test" && progressData.completed) {
          newProgress.test_completed = true;
          newProgress.earned_xp += progressData.xp || 50;
        }
        
        if (newProgress.intro_completed && 
            newProgress.video_completed && 
            newProgress.practice_completed && 
            newProgress.test_completed) {
          newProgress.completed = true;
        }
        
        return {
          ...prevLesson,
          progress: newProgress
        };
      });
      
      if (progressData.xp) {
        setXp(prevXp => prevXp + progressData.xp);
        updateProgress();
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error updating progress:", error);
      return { success: false, error: error.message };
    }
  };
  
  // Переход по шагам
  const goToNextStep = () => {
    if (currentStep === 1) {
      setActiveSection("video");
      setCurrentStep(2);
      updateUserProgress({ 
        section: "intro", 
        completed: true,
        xp: 25 
      });
    } else if (currentStep === 2) {
      setActiveSection("practice");
      setCurrentStep(3);
      updateUserProgress({ 
        section: "video", 
        completed: true,
        xp: 25 
      });
    } else if (currentStep === 3) {
      setActiveSection("test");
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setActiveSection("cert");
      setCurrentStep(5);
      updateUserProgress({ 
        section: "course", 
        completed: true,
        xp: 350 
      });
      setCourseCompleted(true);
    }
    
    updateProgress();
  };
  
  // Расчет процентов прогресса
  const updateProgress = () => {
    const newProgress = (xp / xpToNextLevel) * 100;
    setProgress(newProgress > 100 ? 100 : newProgress);
  };
  
  // Обработка отправки кода
  const submitCode = async () => {
    try {
      setIsLoading(true);
      const response = await coursesAPI.checkCode(lessonId, codeValue);
      
      setFeedback({
        success: response.data.success,
        message: response.data.message
      });
      
      if (response.data.success) {
        updateUserProgress({ 
          section: "practice", 
          completed: true,
          xp: 75 
        });
      }
      
    } catch (error) {
      console.error("Error submitting code:", error);
      setFeedback({
        success: false,
        message: "Произошла ошибка при проверке кода."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработка завершения теста
  const completeTestSection = async () => {
    if (!currentLesson || !currentLesson.test) return;
    
    try {
      setIsLoading(true);
      const response = await coursesAPI.submitTest(lessonId, testAnswers);
      
      setTestScore(response.data.score);
      setTestSubmitted(true);
      
      if (response.data.passed) {
        updateUserProgress({ 
          section: "test", 
          completed: true,
          xp: 100 
        });
      }
      
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Произошла ошибка при проверке теста.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Обработка выбора ответа в тесте
  const handleAnswerChange = (question, value) => {
    setTestAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };
  
  // Обработка лайка/дизлайка
  const handleLike = async () => {
    try {
      if (!liked) {
        await coursesAPI.likeLesson(lessonId);
        setLikeCount(likeCount + 1);
        setLiked(true);
        
        if (disliked) {
          await coursesAPI.removeReaction(lessonId);
          setDisliked(false);
          setDislikeCount(dislikeCount - 1);
        }
      } else {
        await coursesAPI.removeReaction(lessonId);
        setLikeCount(likeCount - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };
  
  const handleDislike = async () => {
    try {
      if (!disliked) {
        await coursesAPI.dislikeLesson(lessonId);
        setDislikeCount(dislikeCount + 1);
        setDisliked(true);
        
        if (liked) {
          await coursesAPI.removeReaction(lessonId);
          setLiked(false);
          setLikeCount(likeCount - 1);
        }
      } else {
        await coursesAPI.removeReaction(lessonId);
        setDislikeCount(dislikeCount - 1);
        setDisliked(false);
      }
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };
  
  // Добавление комментария
  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        const response = await coursesAPI.addComment(lessonId, { text: commentText });
        setComments([response.data, ...comments]);
        setCommentText("");
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Не удалось добавить комментарий");
      }
    }
  };
  
  // Функции навигации
  const changeCourse = (newCourseId) => {
    navigate(`/course/${newCourseId}/lesson/1.1`);
  };
  
  const goToLesson = (moduleId, lessonId) => {
    navigate(`/course/${courseId}/lesson/${moduleId}.${lessonId}`);
    setMenuOpen(false);
  };
  
  // Функции для скачивания сертификата
  const downloadCertificate = () => {
    const certificateElement = document.querySelector('.certificate');
    const footerElement = document.querySelector('.certificate-footer');
    
    if (!certificateElement || !footerElement) return;
    
    const originalDisplay = footerElement.style.display;
    footerElement.style.display = 'none';
    
    html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: false
    }).then(canvas => {
      footerElement.style.display = originalDisplay;
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentCourse?.title || "Course"}_certificate.pdf`);
    });
  };
  
  if (isLoading && !currentCourse) {
    return (
      <div className="loading-container">
        <div className="loading">Загрузка курса...</div>
      </div>
    );
  }
  
  if (error && !currentCourse) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button 
          className="btn-primary" 
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }
  
  return (
    <div className="course-player-page">
      <Header />
      <div className="player-content">
        <aside className={`player-sidebar ${menuOpen ? "sidebar-open" : ""}`}>
          <div className="course-info">
            <h2 className="course-title">{currentCourse?.title || "Загрузка..."}</h2>
            <div className="xp-container">
              <div className="xp-text">
                <span>Прогресс XP:</span>
                <span>{xp} / {xpToNextLevel}</span>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{width: `${progress}%`}}></div>
              </div>
            </div>
            <div className="course-selector">
              <label htmlFor="coursePicker">Выбрать курс:</label>
              <select 
                id="coursePicker"
                value={courseId}
                onChange={(e) => changeCourse(e.target.value)}
                className="course-select"
              >
                {allCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="course-navigation">
            {courseModules.map((module, moduleIndex) => (
              <div key={module.id} className="course-module">
                <div className="module-header">
                  <div className="module-number">{moduleIndex + 1}</div>
                  <div className="module-title">{module.title}</div>
                </div>
                <ul className="lesson-list">
                  {module.lessons && module.lessons.map((lesson, lessonIndex) => {
                    const lessonIdentifier = `${moduleIndex + 1}.${lessonIndex + 1}`;
                    const isCurrentLesson = lessonId === lessonIdentifier;
                    
                    return (
                      <li
                        key={lesson.id}
                        className={`lesson-item ${isCurrentLesson ? 'current' : ''} ${
                          lesson.progress?.completed ? 'completed' : ''
                        }`}
                      >
                        <a 
                          className="lesson-link"
                          onClick={() => goToLesson(moduleIndex + 1, lessonIndex + 1)}
                        >
                          <span className="lesson-title">{lesson.title}</span>
                          {lesson.progress?.completed && <Check size={16} className="lesson-completed-icon" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <main className="lesson-main">
          <div className="top-progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
          
          <div className="lesson-header">
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={24} />
            </button>
            <div className="lesson-info">
              <h1>{currentLesson?.title || "Загрузка..."}</h1>
              <span className="lesson-progress">Шаг {currentStep} из {totalSteps}</span>
            </div>
            <div className="section-tabs">
              <button 
                className={`section-tab ${activeSection === "intro" ? "active" : ""}`}
                onClick={() => setActiveSection("intro")}
                disabled={currentStep < 1}
              >
                Введение
              </button>
              <button 
                className={`section-tab ${activeSection === "video" ? "active" : ""}`}
                onClick={() => setActiveSection("video")}
                disabled={currentStep < 2}
              >
                Видео
              </button>
              <button 
                className={`section-tab ${activeSection === "practice" ? "active" : ""}`}
                onClick={() => setActiveSection("practice")}
                disabled={currentStep < 3}
              >
                Практика
              </button>
              <button 
                className={`section-tab ${activeSection === "test" ? "active" : ""}`}
                onClick={() => setActiveSection("test")}
                disabled={currentStep < 4}
              >
                Тест
              </button>
              <button 
                className={`section-tab ${activeSection === "cert" ? "active" : ""}`}
                onClick={() => setActiveSection("cert")}
                disabled={currentStep < 5}
              >
                Сертификат
              </button>
            </div>
          </div>
          
          <div className="section-content">
            {activeSection === "intro" && currentLesson?.intro && (
              <div className="intro-section">
                <h2 className="lesson-title">{currentLesson.intro.title}</h2>
                <div 
                  className="lesson-text"
                  dangerouslySetInnerHTML={{ __html: currentLesson.intro.content }}
                />
                <div className="lesson-actions">
                  <button className="btn-primary" onClick={goToNextStep}>
                    Продолжить
                  </button>
                </div>
              </div>
            )}

            {activeSection === "video" && (
              <div className="video-section">
                <h2 className="lesson-title">Видеоурок</h2>
                <div className="video-container">
                  <div className="video-content">
                    <iframe
                      width="100%"
                      height="100%"
                      src={currentLesson?.video?.url || "https://www.youtube.com/embed/ix9cRaBkVe0"}
                      title="Видеоурок"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="video-description">
                  <h3>О чем этот урок</h3>
                  <p>
                    {currentLesson?.video?.description || 
                     "В этом видеоуроке мы рассмотрим основные концепции программирования и практические примеры."}
                  </p>
                </div>
                <div className="lesson-actions">
                  <button className="btn-primary" onClick={goToNextStep}>
                    Перейти к практике
                  </button>
                </div>
              </div>
            )}
            
            {activeSection === "practice" && currentLesson?.practice && (
              <div className="practice-section">
                <h2 className="lesson-title">Практическое задание</h2>
                <div className="practice-instructions">
                  <h3>Задание</h3>
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.practice.instructions }} />
                </div>
                
                <div className="code-editor">
                  <textarea
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    className="code-textarea"
                    spellCheck="false"
                  />
                </div>
                
                {feedback && (
                  <div className={`feedback-message ${feedback.success ? 'success' : 'error'}`}>
                    {feedback.success ? <Check size={20} /> : <XCircle size={20} />}
                    <p>{feedback.message}</p>
                  </div>
                )}
                
                <div className="lesson-actions">
                  <button className="btn-primary" onClick={submitCode} disabled={isLoading}>
                    {isLoading ? "Проверка..." : "Проверить код"}
                  </button>
                  {feedback && feedback.success && (
                    <button className="btn-secondary" onClick={goToNextStep}>
                      Перейти к тесту
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {activeSection === "test" && currentLesson?.test && (
              <div className="test-section">
                <h2 className="lesson-title">Проверьте свои знания</h2>
                
                {!testSubmitted ? (
                  <div className="test-questions">
                    {currentLesson.test.map((question) => (
                      <div key={question.id} className="test-question">
                        <h3>{question.question}</h3>
                        <div className="answer-options">
                          {question.options.map((option) => (
                            <label key={option.id} className="answer-option">
                              <input 
                                type="radio"
                                name={`question${question.id}`}
                                value={option.id}
                                checked={testAnswers[`question${question.id}`] === option.id.toString()}
                                onChange={() => handleAnswerChange(`question${question.id}`, option.id.toString())}
                              />
                              <span>{option.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="lesson-actions">
                      <button 
                        className="btn-primary"
                        onClick={completeTestSection}
                        disabled={Object.keys(testAnswers).length < (currentLesson.test?.length || 0) || 
                                 Object.values(testAnswers).some(val => !val) || isLoading}
                      >
                        {isLoading ? "Проверка..." : "Проверить результаты"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="test-results">
                    <h3>Ваш результат: {testScore} из {currentLesson.test?.length || 0}</h3>
                    {testScore >= (currentLesson.test?.length || 0) * 0.7 ? (
                      <div className="success-message">
                        <p>Поздравляем! Вы успешно прошли тест.</p>
                        <div className="lesson-actions">
                          <button className="btn-primary" onClick={goToNextStep}>
                            Получить сертификат
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="error-message">
                        <p>К сожалению, вам нужно правильно ответить как минимум на 70% вопросов, чтобы пройти тест.</p>
                        <div className="lesson-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => {
                              setTestSubmitted(false);
                              const initialAnswers = {};
                              currentLesson.test?.forEach(question => {
                                initialAnswers[`question${question.id}`] = "";
                              });
                              setTestAnswers(initialAnswers);
                              setTestScore(null);
                            }}
                          >
                            Попробовать снова
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeSection === "cert" && (
              <div className="cert-section">
                <div className="certificate" id="certificate-container">
                  <div className="certificate-header">
                    <img className="cerflogo" src={cerflogo} alt="Логотип сертификата" />
                    <h2 className="txt-cert">Сертификат от Akatsuki Courses</h2>
                  </div>
                  
                  <div className="certificate-body">
                    <div className="user-photo-container">
                      {isLoading ? (
                        <div className="photo-loading">Загрузка фото...</div>
                      ) : (
                        <img 
                          src={userPhoto || "/api/placeholder/150/150"} 
                          alt="Фото пользователя" 
                          className="user-photo" 
                        />
                      )}
                    </div>
                    <p className="cert-text">Этот сертификат подтверждает, что</p>
                    <p className="cert-name">{userData?.nickname || localStorage.getItem('userNickname') || "Ученик"}</p>
                    <p className="cert-text">успешно завершил курс</p>
                    <p className="cert-course">{currentCourse?.title || "Курс программирования"}</p>
                    <p className="cert-date">Дата выдачи: {new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <div className="certificate-footer">
                    <button className="btn-primary download-btn" onClick={downloadCertificate}>
                      <Download size={16} />
                      Скачать сертификат
                    </button>
                    <button className="btn-secondary">
                      Поделиться
                    </button>
                  </div>
                </div>
                
                <div className="course-footer">
                  <div className="next-steps">
                    <h3>Что дальше?</h3>
                    <p>Рекомендуем вам пройти следующие курсы для развития ваших навыков:</p>
                    
                    <div className="course-recommendations">
                      {allCourses
                        .filter(course => course.id !== courseId)
                        .slice(0, 3)
                        .map(course => (
                          <div key={course.id} className="recommended-course">
                            <h4>{course.title}</h4>
                            <button 
                              className="btn-outline"
                              onClick={() => changeCourse(course.id)}
                            >
                              Начать
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="comments-section">
              <h3>
                <MessageSquare size={20} />
                Комментарии
              </h3>
              
              <div className="add-comment">
                <div className="comment-header">
                  <div className="comment-avatar">
                    <img src="/api/placeholder/40/40" alt="Ваш аватар" />
                  </div>
                  <div className="comment-input-container">
                    <textarea 
                      className="comment-input"
                      placeholder="Оставьте комментарий или задайте вопрос..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    >
                    </textarea>
                    <div className="comment-submit">
                      <button 
                        className="submit-button"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                      >
                        Отправить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-avatar">
                      <img src="/api/placeholder/40/40" alt={comment.user?.nickname || "Пользователь"} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-meta">
                        <span className="comment-author">{comment.user?.nickname || "Пользователь"}</span>
                        <span className="comment-time">
                          {comment.created_at 
                            ? new Date(comment.created_at).toLocaleDateString('ru-RU', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'только что'
                          }
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <div className="comment-actions">
                        <button className="rating-btn">
                          <ThumbsUp size={16} />
                          <span>{comment.likes_count || 0}</span>
                        </button>
                        <button className="rating-btn">
                          Ответить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="engagement-section">
              <h3>Оцените урок</h3>
              <div className="rating-buttons">
                <button 
                  className={`rating-btn ${liked ? 'active' : ''}`}
                  onClick={handleLike}
                >
                  <ThumbsUp size={20} />
                  <span>{likeCount}</span>
                </button>
                <button 
                  className="rating-btn ${disliked ? 'active' : ''}"
                  onClick={handleDislike}
                >
                  <ThumbsDown size={20} />
                  <span>{dislikeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayerPage;