import React, { useRef, useEffect } from "react";
import "./Reviews.css";
import avatar0 from "../../assets/images/user-avatar.png"; // Стандартная аватарка
import avatar1 from "../../assets/images/avatar-arman.png";
import avatar2 from "../../assets/images/ayase.png";
import avatar3 from "../../assets/images/avatar-3.png";
import avatar4 from "../../assets/images/avatar-4.png";
import avatar5 from "../../assets/images/avatar-5.png";


// Функция для выбора аватарки на основе ID (приме

const testimonials = [
  {
    id: 1,
    name: "Арман С.",
    text: "Понравились курсы! Информация подается четко и доступно. Особенно понравилась система XP, хочется учиться дальше!",
    role: "Full Stack Developer",
    rating: 5,
    avatar: avatar1,
    date: "Октябрь 2020"
  },
  {
    id: 2,
    name: "Амина К.",
    text: "Благодаря практическим заданиям я смогла сразу применить знания на деле. Отличный курс!",
    role: "UX Дизайнер",
    rating: 4.8,
    avatar: avatar2,
    date: "Июнь 2017"
  },
  {
    id: 3,
    name: "Иван Д.",
    text: "Тестирование помогло закрепить материал, а сертификат теперь висит у меня на стене. Спасибо!",
    role: "Java Developer",
    rating: 5,
    avatar: avatar3,
    date: "Январь 2023"
  },
  {
    id: 4,
    name: "Джон К.",
    text: "Обучение в удобном темпе и поддержка менторов 24/7 - именно то, что нужно для успешного старта в программировании.",
    role: "Python Developer",
    rating: 5,
    avatar: avatar4,
    date: "Сентябрь 2018"
  },
  {
    id: 5,
    name: "Дмитрий П.",
    text: "Интерактивные задания и проекты дали реальный опыт разработки. Теперь я уверенно могу добавить новые навыки в резюме!",
    role: "Backend Engineer",
    rating: 4.7,
    avatar: avatar0,
    date: "Март 2025"
    

  },
  {
    id: 6,
    name: "Хусан С.",
    text: "После курса получила предложение о работе в IT-компании. Спасибо за качественное и современное обучение!",
    role: "Full Stack Developer",
    rating: 5,
    avatar: avatar5,
    date: "Август 2019"
    
  }
];

const Testimonials = () => {
  const scrollRef = useRef(null);

    
    // Пауза при наведении курсора
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        
        let animationId;
        let startTime;
        let pauseTime = 0;
        let pausedAt = 0;
        const duration = 50000; // Увеличенная длительность для более плавной прокрутки
        const totalWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          
          // Вычисляем прогресс с учетом паузы
          const elapsed = (timestamp - startTime) - pauseTime;
          const progress = Math.min(elapsed / duration, 1);
          
          scrollContainer.scrollLeft = progress * totalWidth;
          
          if (progress < 1) {
            animationId = requestAnimationFrame(step);
          } else {
            // Сброс для бесконечной прокрутки, но сохраняем плавность
            startTime = timestamp;
            pauseTime = 0;
            animationId = requestAnimationFrame(step);
          }
        };
        
        animationId = requestAnimationFrame(step);
        
        // Пауза при наведении курсора
        const pauseScroll = () => {
          cancelAnimationFrame(animationId);
          pausedAt = performance.now(); // Запоминаем время паузы
        };
        
        // Возобновление прокрутки с того же места
        const resumeScroll = () => {
          if (pausedAt > 0) {
            // Добавляем время паузы к общему времени паузы
            pauseTime += performance.now() - pausedAt;
            pausedAt = 0;
          }
          animationId = requestAnimationFrame(step);
        };
        
        scrollContainer.addEventListener('mouseenter', pauseScroll);
        scrollContainer.addEventListener('mouseleave', resumeScroll);
        
        return () => {
          cancelAnimationFrame(animationId);
          scrollContainer.removeEventListener('mouseenter', pauseScroll);
          scrollContainer.removeEventListener('mouseleave', resumeScroll);
        };
      }, []);

  // Функция для отображения звездочек рейтинга
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="testimonial-rating">
        {Array(fullStars).fill().map((_, i) => (
          <span key={`star-${i}`} className="star">★</span>
        ))}
        
        {hasHalfStar && <span className="star half">★</span>}
        
        {Array(emptyStars).fill().map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </div>
    );
  };
  
  // Создаем копию массива отзывов для дублирования
  // Для дублирования используем новый массив вместо рендеринга дважды
  const allTestimonials = [...testimonials, ...testimonials.map(item => ({
    ...item, 
    id: `dup-${item.id}`,
    // Чтобы гарантировать, что каждая карточка имеет достаточно места:
    text: item.text // Убедитесь, что текст не сжимается
  }))];

  return (
    <div className="testimonials-section">
      <h2 className="testimonials-title">
        <span className="red-text">ОТЗЫВЫ</span> <span className="white-text">НАШИХ СТУДЕНТОВ</span>
      </h2>
      
      <div className="testimonials-container" ref={scrollRef}>
        <div className="testimonials-wrapper">
          {allTestimonials.map((testimonial, index) => (
        <div 
            key={testimonial.id} 
            className="testimonial-card"
            style={{"--index": index,
      // Фиксированная ширина:
            width: "350px",
            minWidth: "350px",
            flex: "0 0 350px"
        }}
         >
              <div className="testimonial-avatar">
               <img src={testimonial.avatar} alt={`${testimonial.name} аватар`} />
              </div>
              <h3 className="testimonial-name">{testimonial.name}</h3>
              <div className="testimonial-role">{testimonial.role}</div>
              {renderStars(testimonial.rating)}
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-date">{testimonial.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;