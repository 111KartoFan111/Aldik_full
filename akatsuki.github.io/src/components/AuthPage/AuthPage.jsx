import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/akat.png";
import { authAPI } from "../../services/api"; // Импортируем API сервис
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "" // Это название поля в форме, но на сервер отправляем как nickname
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Отправляем запрос на вход
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        // Сохраняем токен и данные пользователя
        if (response.data.access_token) {
          localStorage.setItem('authToken', response.data.access_token);
          localStorage.setItem('isAuthenticated', 'true');
          
          // Если есть данные о пользователе, сохраняем
          if (response.data.user) {
            localStorage.setItem('userNickname', response.data.user.nickname);
            localStorage.setItem('userId', response.data.user.id);
          }
          
          // Перенаправляем на главную
          navigate("/");
        }
      } else {
        // Отправляем запрос на регистрацию
        const response = await authAPI.register({
          name: formData.name, // authAPI.register уже преобразует это в nickname
          email: formData.email,
          password: formData.password
        });
        
        if (response.status === 201) {
          // Показываем сообщение об успешной регистрации
          setError(""); // Очищаем ошибки
          alert("Регистрация успешна! Теперь вы можете войти в систему.");
          
          // Переключаемся на форму входа и заполняем поля данными
          setIsLogin(true);
          setFormData({
            ...formData,
            password: "" // Очищаем только пароль
          });
        }
      }
    } catch (err) {
      console.error("Ошибка аутентификации:", err);
      setError(
        err.response?.data?.detail || 
        "Произошла ошибка при авторизации. Пожалуйста, попробуйте еще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Логотип" />
        </div>
        <h2>{isLogin ? "Вход в аккаунт" : "Регистрация"}</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Никнейм</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading 
              ? "Загрузка..." 
              : isLogin 
                ? "Войти" 
                : "Зарегистрироваться"}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <span onClick={toggleForm}>
              {isLogin ? " Зарегистрироваться" : " Войти"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;