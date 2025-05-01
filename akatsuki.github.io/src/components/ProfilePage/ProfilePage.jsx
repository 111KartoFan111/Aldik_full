import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ProfilePage.css";
import userAvatar from "../../assets/images/User/User_01.svg";
import settingsIcon from "../../assets/images/Setting/Settings.svg";
import certificateIcon from "../../assets/images/Warning/Wavy_Check.svg";
import courseIcon from "../../assets/images/System/Terminal.svg";
import reviewIcon from "../../assets/images/Interface/Chart_Bar_Vertical_01.svg";
import { profileAPI, coursesAPI, authAPI } from "../../services/api";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({
    name: "Загрузка...",
    rank: "Загрузка...",
    xp: 0,
    maxXp: 1000,
    nextRank: "Загрузка...",
    courses: [],
    certificates: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  // Функция для получения следующего ранга
  const getNextRank = (rank) => {
    switch(rank) {
      case "Генин": return "Чуунин";
      case "Чуунин": return "Джонин";
      case "Джонин": return "Каге";
      case "Каге": return "Максимум";
      default: return "Чуунин";
    }
  };
  
  // Загрузка данных пользователя
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем данные профиля
      const profileResponse = await profileAPI.getUserProfile();
      const userProfile = profileResponse.data;
      
      console.log("Данные профиля получены:", userProfile);
      
      // Получаем курсы пользователя
      const coursesResponse = await coursesAPI.getUserCourses();
      const userCourses = coursesResponse.data;
      
      console.log("Курсы пользователя получены:", userCourses);
      
      // Обработка данных для отображения
      const rank = getRank(userProfile.xp);
      const maxXp = getMaxXP(rank);
      const nextRank = getNextRank(rank);
      
      // Создаем сертификаты на основе завершенных курсов
      const certificates = userCourses
        .filter(course => course.status === "completed")
        .map(course => ({
          id: course.id,
          name: course.course?.title || "Курс",
          date: new Date(course.completed_at || Date.now()).toLocaleDateString(),
          image: "/api/placeholder/200/150"
        }));
      
      setUserData({
        id: userProfile.id,
        name: userProfile.nickname,
        email: userProfile.email,
        rank: rank,
        xp: userProfile.xp,
        maxXp: maxXp,
        nextRank: nextRank,
        courses: userCourses,
        certificates: certificates
      });
      
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      setError("Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.");
      
      // Если ошибка 401, перенаправляем на страницу логина
      if (error.response && error.response.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };
  
  const renderOverview = () => (
    <div className="profile-overview">
      <div className="user-stats">
        <div className="user-avatar-large">
          <img src={userAvatar} alt="Аватар пользователя" />
        </div>
        <div className="user-info-large">
          <h2>{userData.name}</h2>
          <div className="rank-info">
            <div className="rank-title">Звание: {userData.rank}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${(userData.xp / userData.maxXp) * 100}%` }}></div>
            </div>
            <div className="xp-info">XP: {userData.xp}/{userData.maxXp}</div>
            <div className="next-rank">Следующее звание: {userData.nextRank}</div>
          </div>
        </div>
      </div>
      
      <div className="profile-sections">
        <div className="profile-section">
          <h3>Активные курсы</h3>
          <div className="active-courses">
            {loading ? (
              <div className="loading">Загрузка курсов...</div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userData.courses.length > 0 ? (
              userData.courses
                .filter(course => course.status === "in_progress")
                .map(course => (
                  <div className="course-card" key={course.id}>
                    <div className="course-imagee">
                      <img src="/api/placeholder/120/90" alt={course.course?.title || "Курс"} />
                    </div>
                    <div className="course-info">
                      <h4>{course.course?.title || "Курс"}</h4>
                      <div className="course-progress">
                        <div className="progress-container">
                          <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <span>{course.progress}%</span>
                      </div>
                      <Link to={`/course/${course.course_id}/lesson/1`} className="continue-btn">
                        Продолжить
                      </Link>
                    </div>
                  </div>
                ))
            ) : (
              <p>У вас пока нет активных курсов</p>
            )}
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Последние сертификаты</h3>
          <div className="certificates-preview">
            {loading ? (
              <div className="loading">Загрузка сертификатов...</div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : userData.certificates.length > 0 ? (
              userData.certificates.slice(0, 2).map(cert => (
                <div className="certificate-card" key={cert.id}>
                  <div className="certificate-image">
                    <img src={cert.image} alt={cert.name} />
                  </div>
                  <div className="certificate-info">
                    <h4>{cert.name}</h4>
                    <p>Получен: {cert.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>У вас пока нет полученных сертификатов</p>
            )}
            {userData.certificates.length > 2 && (
              <button className="view-all-btn" onClick={() => setActiveTab("certificates")}>
                Посмотреть все
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderCourses = () => (
    <div className="profile-courses">
      <h2>Мои курсы</h2>
      <div className="courses-grid">
        {loading ? (
          <div className="loading">Загрузка курсов...</div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : userData.courses.length > 0 ? (
          userData.courses.map(course => (
            <div className="course-card-full" key={course.id}>
              <div className="course-imagee">
                <img src="/api/placeholder/300/160" alt={course.course?.title || "Курс"} />
              </div>
              <div className="course-details">
                <h3>{course.course?.title || "Курс"}</h3>
                <div className="course-progress">
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span>{course.progress}%</span>
                </div>
              </div>
              <div className="course-actions">
                <Link 
                  to={`/course/${course.course_id}/lesson/1`} 
                  className="continue-btn"
                >
                  {course.status === "completed" ? "Повторить" : "Продолжить"}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>У вас пока нет курсов</p>
        )}
      </div>
    </div>
  );
  
  const renderCertificates = () => (
    <div className="profile-certificates">
      <h2>Мои сертификаты</h2>
      <div className="certificates-grid">
        {loading ? (
          <div className="loading">Загрузка сертификатов...</div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : userData.certificates.length > 0 ? (
          userData.certificates.map(cert => (
            <div className="certificate-card-full" key={cert.id}>
              <div className="certificate-image">
                <img src={cert.image} alt={cert.name} />
              </div>
              <div className="certificate-details">
                <h3>{cert.name}</h3>
                <p>Получен: {cert.date}</p>
                <button className="download-btn">Скачать PDF</button>
              </div>
            </div>
          ))
        ) : (
          <p>У вас пока нет полученных сертификатов</p>
        )}
      </div>
    </div>
  );
  
  const renderSettings = () => (
    <div className="profile-settings">
      <h2>Настройки профиля</h2>
      <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Имя</label>
          <input type="text" name="name" defaultValue={userData.name} disabled={loading} />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" defaultValue={userData.email} disabled={loading} />
        </div>
        
        <div className="form-group">
          <label>Изменить пароль</label>
          <input type="password" name="currentPassword" placeholder="Текущий пароль" disabled={loading} />
          <input type="password" name="newPassword" placeholder="Новый пароль" disabled={loading} />
          <input type="password" name="confirmPassword" placeholder="Подтвердите пароль" disabled={loading} />
        </div>
        
        <div className="form-group">
          <label>Уведомления</label>
          <div className="checkbox-group">
            <input type="checkbox" id="emailNotifications" name="emailNotifications" defaultChecked disabled={loading} />
            <label htmlFor="emailNotifications">Получать уведомления по email</label>
          </div>
        </div>
        
        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Загрузка..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
  
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "courses":
        return renderCourses();
      case "certificates":
        return renderCertificates();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };
  
  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <img src={userAvatar} alt="Аватар пользователя" />
            </div>
            <div className="user-details">
              <h3>{userData.name}</h3>
              <p>{userData.rank}</p>
              <div className="xp-bar">
                <div className="xp-progress" style={{ width: `${(userData.xp / userData.maxXp) * 100}%` }}></div>
              </div>
              <p className="xp-text">XP: {userData.xp}/{userData.maxXp}</p>
            </div>
          </div>
          
          <nav className="profile-nav">
            <ul>
              <li 
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => setActiveTab("overview")}
              >
                <span className="icon">
                  <img src={reviewIcon} alt="Обзор" />
                </span>
                Обзор
              </li>
              <li 
                className={activeTab === "courses" ? "active" : ""}
                onClick={() => setActiveTab("courses")}
              >
                <span className="icon">
                  <img src={courseIcon} alt="Курсы" />
                </span>
                Мои курсы
              </li>
              <li 
                className={activeTab === "certificates" ? "active" : ""}
                onClick={() => setActiveTab("certificates")}
              >
                <span className="icon">
                  <img src={certificateIcon} alt="Сертификаты" />
                </span>
                Сертификаты
              </li>
              <li 
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                <span className="icon">
                  <img src={settingsIcon} alt="Настройки" />
                </span>
                Настройки
              </li>
            </ul>
          </nav>
          
          <div className="logout-btn">
            <a href="#" onClick={handleLogout}>Выйти</a>
          </div>
        </div>
        
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;