import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Navigation, Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import './SliderL.css';

// Импортируем иконки языков программирования
import pythonIcon from '../../assets/images/python-icon.svg';
import reactIcon from '../../assets/images/react-icon.svg';
import htmlIcon from '../../assets/images/html-icon.svg';
import cssIcon from '../../assets/images/css-icon.svg';
// Импортируем новые иконки
import cppIcon from '../../assets/images/cpp.svg';
import csharpIcon from '../../assets/images/charp.svg';
import jsIcon from '../../assets/images/JavaScript.svg';

const languages = [
  {
    id: 1,
    name: 'Python',
    icon: pythonIcon,
    description: [
      'Простой и мощный язык',
      'Идеален для ИИ, автоматизации и веба',
      'Огромное сообщество и библиотеки'
    ],
    buttonText: 'Изучить Технику'
  },
  {
    id: 2,
    name: 'React',
    icon: reactIcon,
    description: [
      'Библиотека для создания интерфейсов',
      'Компонентный подход и высокая скорость',
      'Используется в топовых проектах'
    ],
    buttonText: 'Изучить Технику'
  },
  {
    id: 3,
    name: 'HTML & CSS',
    icons: [htmlIcon, cssIcon],
    description: [
      'HTML - структура, CSS - стиль',
      'Основа всего сайта',
      'Позволяют создавать адаптивные и красивые страницы'
    ],
    buttonText: 'Изучить Технику'
  },
  // Добавляем новые языки
  {
    id: 4,
    name: 'C++',
    icon: cppIcon,
    description: [
      'Высокопроизводительный язык',
      'Используется в игровой индустрии и системном ПО',
      'Мощные инструменты для работы с памятью'
    ],
    buttonText: 'Изучить Технику'
  },
  {
    id: 5,
    name: 'C#',
    icon: csharpIcon,
    description: [
      'Универсальный язык от Microsoft',
      'Идеален для .NET-приложений и Unity',
      'Совмещает простоту и производительность'
    ],
    buttonText: 'Изучить Технику'
  },
  {
    id: 6,
    name: 'JavaScript',
    icon: jsIcon,
    description: [
      'Язык веб-разработки №1',
      'Работает на клиенте и сервере (Node.js)',
      'Огромная экосистема и фреймворки'
    ],
    buttonText: 'Изучить Технику'
  }
];

export const LanguagesSwiper = ({ onLanguageClick }) => {
  return (
    <div className="languages-swiper-container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 15,          // Уменьшаем угол поворота для более естественного вида
          stretch: 0,
          depth: 120,          // Уменьшаем глубину для меньшего искажения
          modifier: 1.5,        
          slideShadows: false,  // Отключаем тени слайдов для лучшей видимости содержимого
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        autoplay={{
          delay: 3500,          // Увеличиваем задержку для более комфортного просмотра
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1200}            // Увеличиваем время анимации для более плавного перехода
        initialSlide={0}
        modules={[Navigation, Autoplay, EffectCoverflow, Pagination]}
        className="languages-swiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2.5,    // Показываем 2.5 слайда для лучшего обзора
            spaceBetween: 40,
          },
        }}
      >
        {languages.map((language) => (
          <SwiperSlide key={language.id} className="language-card-slide">
            <div className="language-card">
              <div className="language-content">
                <div className="language-header">
                  {language.icons ? (
                    <div className="html-css-icons">
                      <img src={language.icons[0]} alt="HTML" className="language-icon" />
                      <span>+</span>
                      <img src={language.icons[1]} alt="CSS" className="language-icon" />
                    </div>
                  ) : (
                    <img src={language.icon} alt={language.name} className="language-icon" />
                  )}
                  <h3 className="language-name">{language.name}</h3>
                </div>
                <ul className="language-description">
                  {language.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div className="button-container">
                  <button 
                    className="learn-button"
                    onClick={() => onLanguageClick && onLanguageClick(language.name)}
                  >
                    {language.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};