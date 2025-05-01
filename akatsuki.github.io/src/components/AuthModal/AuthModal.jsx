import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess, courseId }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''  // изменено с name на nickname для соответствия бэкенду
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }
    
    // Additional validation for registration
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
      
      if (!formData.nickname) {
        newErrors.nickname = 'Имя (никнейм) обязателен';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isLogin) {
        // Вход
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.status && response.status !== 200) {
          throw response;
        }
        
        // Сохраняем токен
        authAPI.setAuthToken(response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        setSuccessMessage('Вход выполнен успешно!');
        
        // После небольшой задержки закрываем модальное окно и уведомляем родительский компонент
        setTimeout(() => {
          onSuccess && onSuccess({
            email: formData.email,
            nickname: formData.nickname
          });
          
          // Если вход был успешным и у нас есть courseId, записываемся на курс
          if (courseId) {
            enrollInCourse(courseId);
          }
        }, 1500);
      } else {
        // Регистрация
        const response = await authAPI.register({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname
        });
        
        if (response.status && response.status !== 201) {
          throw response;
        }
        
        setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
        
        // После небольшой задержки переключаемся на форму входа
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            ...formData,
            confirmPassword: '',
            password: ''
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      setErrors({
        ...errors,
        general: error.message || 'Произошла ошибка при авторизации'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      await authAPI.coursesAPI.enrollInCourse(courseId);
      console.log('Successfully enrolled in course');
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          <p>{isLogin 
            ? 'Войдите, чтобы записаться на курс и отслеживать свой прогресс' 
            : 'Создайте аккаунт, чтобы получить доступ к курсам и материалам'}</p>
        </div>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nickname">Имя (никнейм)</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Введите ваш никнейм"
                className={errors.nickname ? 'input-error' : ''}
              />
              {errors.nickname && <span className="error-text">{errors.nickname}</span>}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}
          
          <button 
            type="submit" 
            className={`auth-submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading 
              ? 'Подождите...' 
              : (isLogin ? 'Войти' : 'Зарегистрироваться')
            }
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin 
            ? 'Нет аккаунта? ' 
            : 'Уже есть аккаунт? '
          }
          <button 
            type="button" 
            className="toggle-button" 
            onClick={toggleAuthMode}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;