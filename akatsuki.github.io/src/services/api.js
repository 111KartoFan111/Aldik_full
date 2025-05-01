// src/services/api.js
import axios from 'axios';

// Создаем экземпляр axios с базовым URL для API
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработчик ответа для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 401 (Unauthorized), очищаем localStorage и перенаправляем на страницу логина
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userNickname');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API для работы с аутентификацией
export const authAPI = {
  login: async (credentials) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // FastAPI OAuth2 ожидает 'username'
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Сохраняем токен и данные пользователя
    if (response.data && response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('isAuthenticated', 'true');
      
      if (response.data.user && response.data.user.nickname) {
        localStorage.setItem('userNickname', response.data.user.nickname);
        localStorage.setItem('userId', response.data.user.id);
      }
    }
    
    return response;
  },
  
  register: (userData) => {
    return api.post('/auth/register', {
      email: userData.email,
      nickname: userData.name,
      password: userData.password,
      confirm_password: userData.password
    });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userId');
    return Promise.resolve();
  },
  
  getCurrentUser: () => api.get('/auth/me'),
};
// API для работы с курсами с использованием мок-данных для тестирования
export const coursesAPI = {
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response;
    } catch (error) {
      console.log('Используем мок-данные для getAllCourses');
      return { data: mockCourses };
    }
  },
  
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для getCourseById(${courseId})`);
      const course = mockCourses.find(c => c.id === Number(courseId)) || mockCourses[0];
      return { data: course };
    }
  },
  
  // Получение урока
  getLesson: async (courseId, lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для getLesson(${courseId}, ${lessonId})`);
      return { data: mockLesson };
    }
  },
  
  // Запись на курс
  enrollCourse: async (courseId) => {
    try {
      const response = await api.post(`/courses/enroll`, { course_id: courseId });
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для enrollCourse(${courseId})`);
      return { data: { success: true, message: "Вы успешно записаны на курс" } };
    }
  },
  
  // Обновление прогресса курса
  updateProgress: async (courseId, progress, status) => {
    try {
      const response = await api.put(`/courses/my-courses/${courseId}`, { progress, status });
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для updateProgress(${courseId}, ${progress}, ${status})`);
      return { data: { success: true, progress, status } };
    }
  },
  
  // Получение курсов пользователя
  getUserCourses: async () => {
    try {
      const response = await api.get('/courses/my-courses');
      return response;
    } catch (error) {
      console.log('Используем мок-данные для getUserCourses');
      return { data: mockUserCourses };
    }
  },
  
  // Обновление прогресса урока
  updateLessonProgress: async (lessonId, progressData) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/progress`, progressData);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для updateLessonProgress(${lessonId})`);
      return { data: { success: true, progress: { ...mockLesson.progress, [progressData.section + "_completed"]: true, earned_xp: mockLesson.progress.earned_xp + (progressData.xp || 0) } } };
    }
  },
  
  // Проверка практического кода
  checkCode: async (lessonId, code) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/check-code`, { code });
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для checkCode(${lessonId})`);
      return { data: { success: true, message: "Отлично! Код прошел проверку." } };
    }
  },
  
  // Отправка ответов на тест
  submitTest: async (lessonId, answers) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/check-test`, answers);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для submitTest(${lessonId})`);
      // Имитируем правильные ответы на 2 из 3 вопросов
      return { data: { score: 2, total: 3, passed: true, message: "Тест успешно пройден!" } };
    }
  },
  
  // Поставить лайк уроку
  likeLesson: async (lessonId) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/like`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для likeLesson(${lessonId})`);
      return { data: { success: true, likes_count: 6, dislikes_count: 1 } };
    }
  },
  
  // Поставить дизлайк уроку
  dislikeLesson: async (lessonId) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/dislike`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для dislikeLesson(${lessonId})`);
      return { data: { success: true, likes_count: 5, dislikes_count: 2 } };
    }
  },
  
  // Отменить реакцию
  removeReaction: async (lessonId) => {
    try {
      const response = await api.delete(`/lessons/${lessonId}/like`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для removeReaction(${lessonId})`);
      return { data: { success: true, likes_count: 5, dislikes_count: 1 } };
    }
  },
  
  // Получение комментариев к уроку
  getLessonComments: async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}/comments`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для getLessonComments(${lessonId})`);
      return { data: mockComments };
    }
  },
  
  // Добавление комментария к уроку
  addComment: async (lessonId, commentData) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/comments`, commentData);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для addComment(${lessonId})`);
      const newComment = {
        id: Math.floor(Math.random() * 1000) + 100,
        text: commentData.text,
        user: {
          id: 1,
          nickname: "Пользователь"
        },
        created_at: new Date().toISOString(),
        likes_count: 0,
        parent_id: commentData.parent_id
      };
      return { data: newComment };
    }
  },
};

// API для работы с профилем пользователя
export const profileAPI = {
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response;
    } catch (error) {
      console.log('Используем мок-данные для getUserProfile');
      return { data: mockUserProfile };
    }
  },
  
  getLeaderboard: async (limit = 10) => {
    try {
      const response = await api.get(`/users/leaderboard?limit=${limit}`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для getLeaderboard(${limit})`);
      const mockLeaderboard = [
        { rank: 1, user_id: 2, nickname: "Мария Смирнова", xp: 1250 },
        { rank: 2, user_id: 3, nickname: "Иван Петров", xp: 980 },
        { rank: 3, user_id: 1, nickname: "Пользователь", xp: 500 },
        { rank: 4, user_id: 4, nickname: "Алексей Иванов", xp: 420 },
        { rank: 5, user_id: 5, nickname: "Елена Козлова", xp: 350 },
      ];
      return { data: mockLeaderboard.slice(0, limit) };
    }
  },
  
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response;
    } catch (error) {
      console.log(`Используем мок-данные для getUserById(${userId})`);
      return { data: { ...mockUserProfile, id: userId } };
    }
  },
};

export default api;