import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/akat.png";
import userIcon from "../../assets/images/User/User_01.svg";
import Profile from "../Profile/Profile";
import "./Header.css";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, авторизован ли пользователь при загрузке компонента
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);
  
  const toggleProfile = () => {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Иначе открываем/закрываем профиль
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Логотип" />
          </Link>
        </div>
        <nav className="navigation">
          <ul className="nav-els">
            <li className="nav-el">
              <Link to="/">Главная</Link>
            </li>
            <li className="nav-el">
              <Link to="/courses">Курсы</Link>
            </li>
            <li className="nav-el">
              <Link to="#">О Нас</Link>
            </li>
            <li className="nav-el">
              <Link to="#">Контакты</Link>
            </li>
          </ul>
        </nav>
        <div className="profile">
          <div className="profile-btn" onClick={toggleProfile}>
            <img src={userIcon} alt="Профиль" />
          </div>
          {isAuthenticated && (
            <Profile 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;