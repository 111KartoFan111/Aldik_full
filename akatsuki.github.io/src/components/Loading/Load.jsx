import React from 'react';
import logo from "../../assets/images/aktre.svg";
import mov from "../../assets/video/akat.mp4";
import "./Load.css";

const Load = ({ onStartLearning }) => {
  return (
    <div id="preloader">
      <video autoPlay muted loop>
        <source src={mov} type="video/mp4" />
      </video>
      <div className="logo-s">
        <img src={logo} alt="Логотип" />
      </div>
      <button className="start-button" onClick={onStartLearning}>
        Начать обучение
      </button>
    </div>
  );
};

export default Load;