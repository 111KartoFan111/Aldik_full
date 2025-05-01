import './Profile.css';
import Exit from "../../assets/images/Interface/Exit.svg";
import Setting from "../../assets/images/Setting/Settings.svg";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, authAPI } from "../../services/api";

const Profile = ({ isOpen, onClose }) => {
    const [xpWidth, setXpWidth] = useState('0%');
    const [userData, setUserData] = useState({
        nickname: 'Загрузка...',
        xp: 0,
        rank: 'Загрузка...',
        id: null
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
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
    
    // Функция получения данных пользователя
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getUserProfile();
            const user = response.data;
            
            const rank = getRank(user.xp);
            const maxXP = getMaxXP(rank);
            
            setUserData({
                nickname: user.nickname,
                xp: user.xp,
                rank: rank,
                maxXp: maxXP,
                id: user.id
            });
            
            // Вычисляем процент XP для прогресс-бара
            const percentage = (user.xp / maxXP) * 100;
            setXpWidth(`${percentage > 100 ? 100 : percentage}%`);
            
        } catch (error) {
            console.error("Ошибка при загрузке данных пользователя:", error);
            // Если нет доступа, используем данные из localStorage
            const nickname = localStorage.getItem('userNickname') || 'Гость';
            setUserData({
                nickname: nickname,
                xp: 0,
                rank: "Генин",
                maxXp: 500,
                id: null
            });
        } finally {
            setLoading(false);
        }
    };
    
    // Функция для навигации к странице профиля
    const goToProfilePage = () => {
        onClose(); 
        navigate('/profile');
    };
    
    // Функция для выхода из системы
    const handleLogout = async () => {
        try {
            await authAPI.logout();
            navigate('/login');
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };
    
    // Загружаем данные пользователя при открытии профиля
    useEffect(() => {
        if (isOpen) {
            fetchUserData();
            setTimeout(() => setXpWidth(`${(userData.xp / userData.maxXp) * 100}%`), 100);
        } else {
            setXpWidth('0%');
        }
    }, [isOpen]);

    return (
        <>
            <div className={`profile-sidebar ${isOpen ? 'active' : 'unactive'}`} id="profileMenu">
                <h2 className="profile-title">Профиль</h2>
                
                <div className="profile-info-container">
                    <div className="profile-info-item">
                        <strong>Имя:</strong> {loading ? 'Загрузка...' : userData.nickname}
                    </div>
                    
                    <div className="profile-info-item">
                        <strong>Звание:</strong> {loading ? 'Загрузка...' : userData.rank}
                    </div>
                    
                    <div className="rank-progress-container">
                        <div className="profile-info-item xp-container">
                            <span>XP: {loading ? '...' : `${userData.xp}/${userData.maxXp}`}</span>
                            <span className="next-rank-label">
                                {loading ? 'Загрузка...' : (userData.rank === "Каге" ? "Максимум" : 
                                    userData.rank === "Генин" ? "Чуунин" : 
                                    userData.rank === "Чуунин" ? "Джонин" : "Каге")}
                            </span>
                        </div>
                        
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: xpWidth }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="profile-actions">
                    <button className="settings-btn" onClick={goToProfilePage}>
                        <img src={Setting} alt="Настройки" />
                        <span>Настройки</span>
                    </button>
                    
                    <button className="logout-button" onClick={handleLogout}>
                        <img src={Exit} alt="Выйти" />
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
            
            {isOpen && (
                <div className="overlay" id="overlay" onClick={onClose}></div>
            )}
        </>
    );
};

export default Profile;