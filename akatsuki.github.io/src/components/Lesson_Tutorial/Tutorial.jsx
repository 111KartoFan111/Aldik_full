import React from "react";
import video from "../../assets/images/video-icon.svg";
import tests from "../../assets/images/test-icon.svg";
import codes from "../../assets/images/code-icon.svg";
import gift from "../../assets/images/gift-icon.svg";
import "./Tutorial.css";

const steps = [
  {
    icon: video,
    title: "Видеоуроки",
    description: "Просматривайте качественные видеоуроки с подробными объяснениями от экспертов. Учитесь в удобном темпе и пересматривайте материал в любое время."
  },
  {
    icon: codes,
    title: "Практика",
    description: "Закрепляйте знания с помощью практических заданий. Выполняйте код, разрабатывайте проекты и получайте обратную связь."
  },
  {
    icon: tests,
    title: "Тестирование",
    description: "Проверьте свои знания с помощью тестов. Получайте мгновенные результаты и рекомендации по улучшению."
  },
  {
    icon: gift,
    title: "Сертификат + XP",
    description: "После успешного завершения курса получите сертификат и XP для прокачки своего профиля."
  }
];

const Tutorial = () => {
  return (
    <div className="tutorial-container">
      <h2 className="tutorial-title">
        <span className="red-text">Как проходит</span> <span className="white-text">обучение?</span>
      </h2>
      <div className="tutorial-cards-grid">
        {steps.map((step, index) => (
          <div key={index} className="tutorial-card">
            <div className="tutorial-card-icon">
              <img src={step.icon} alt={step.title} />
            </div>
            <div className="tutorial-card-content">
              <h3 className="tutorial-card-title">{step.title}</h3>
              <p className="tutorial-card-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;