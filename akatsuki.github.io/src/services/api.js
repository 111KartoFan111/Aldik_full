// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL for API
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

// Authentication API
export const authAPI = {
  // Login using OAuth2 password flow
  login: async (credentials) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data && response.data.access_token) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (response.data.user) {
          localStorage.setItem('userNickname', response.data.user.nickname);
          localStorage.setItem('userId', response.data.user.id);
        }
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // User registration
  register: (userData) => {
    return api.post('/auth/register', {
      email: userData.email,
      nickname: userData.nickname || userData.name,
      password: userData.password,
      confirm_password: userData.password,
    });
  },
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userId');
    return Promise.resolve();
  },
  
  // Get current user info
  getCurrentUser: () => api.get('/auth/me'),
  
  // Set authentication token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }
};

// Course-related API
export const coursesAPI = {
  // Get all available courses
  getAllCourses: () => api.get('/api/courses'),
  
  // Get course by ID with modules
  getCourseById: (courseId) => api.get(`/api/courses/${courseId}`),
  
  // Get lesson by ID
  getLesson: (lessonId) => api.get(`/lessons/${lessonId}`),
  
  // Enroll in course
  enrollInCourse: (courseId) => api.post(`/api/courses/enroll`, { course_id: courseId }),
  
  // Update course progress
  updateCourseProgress: (courseId, progressData) => 
    api.put(`/api/courses/${courseId}/progress`, progressData),

  getCourseProgress: (courseId) => api.get(`/api/courses/${courseId}/progress`),
    
  // Get user's enrolled courses
  getUserCourses: (id) => api.get(`/api/courses/my-courses/${id}`),
  
  // Update lesson progress
  updateLessonProgress: (lessonId, progressData) => 
    api.post(`/lessons/${lessonId}/progress`, progressData),
  
  // Check practice code
  checkCode: (lessonId, code) => 
    api.post(`/lessons/${lessonId}/check-code`, { code }),
  
  // Submit test answers
  submitTest: (lessonId, answers) => 
    api.post(`/lessons/${lessonId}/check-test`, answers),
  
  // Like/dislike lesson
  likeLesson: (lessonId) => api.post(`/lessons/${lessonId}/like`),
  dislikeLesson: (lessonId) => api.post(`/lessons/${lessonId}/dislike`),
  removeReaction: (lessonId) => api.delete(`/lessons/${lessonId}/like`),
  
  // Comments
  getLessonComments: (lessonId) => api.get(`/lessons/${lessonId}/comments`),
  addComment: (lessonId, commentData) => api.post(`/lessons/${lessonId}/comments`, commentData),

  // Проверка наличия сертификата
  checkCertificate: (courseId) => api.get(`/api/courses/${courseId}/certificate`),

  // Генерация сертификата
  generateCertificate: (courseId) => api.post(`/api/courses/${courseId}/certificate`),
};

// User profile API
export const profileAPI = {
  getUserProfile: () => api.get('/users/profile'),
  getLeaderboard: (limit = 10) => api.get(`/users/leaderboard?limit=${limit}`),
  getUserById: (userId) => api.get(`/users/${userId}/profile`),
  // Новый метод для обновления XP пользователя
  updateUserXP: (xpAmount) => api.post('/users/update-xp', { xp: xpAmount }),
    // Обновите метод updateCourseProgress
  updateCourseProgress: (courseId, progressData) => 
    api.put(`/api/courses/${courseId}/progress`, progressData),

  getCourseProgress: (courseId) => api.get(`/api/courses/${courseId}/progress`),
  uploadAvatar: (formData) => {
    return api.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;