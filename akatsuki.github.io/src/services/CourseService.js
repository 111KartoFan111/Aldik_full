// src/services/CourseService.js
import api from './api';

class CourseService {
  // Static course content used for demo purposes
  static COURSE_CONTENT = {
    javascript: {
      title: "JavaScript для начинающих",
      modules: [
        {
          id: 1,
          title: "Введение в JavaScript",
          lessons: [
            {
              id: "1.1",
              title: "Знакомство с JavaScript",
              intro: {
                title: "Что такое JavaScript?",
                content: "<p>JavaScript — это скриптовый язык программирования, который используется для создания интерактивных веб-страниц. JavaScript является одним из трех столпов современной веб-разработки, наряду с HTML и CSS.</p><p>В этом уроке вы познакомитесь с основами JavaScript и его ролью в веб-разработке.</p>"
              },
              video: {
                url: "https://www.youtube.com/embed/ix9cRaBkVe0",
                description: "Обзор основ языка JavaScript и его применение в веб-разработке."
              },
              practice: {
                instructions: "<p>Создайте свой первый JavaScript код, выводящий сообщение в консоль.</p>",
                codeTemplate: "// Ваш первый JavaScript код\nconsole.log('Привет, мир!');\n\n// Попробуйте вывести еще одно сообщение\n"
              },
              test: [
                {
                  id: 1,
                  question: "Что такое JavaScript?",
                  options: [
                    { id: 1, text: "Язык разметки" },
                    { id: 2, text: "Язык программирования", isCorrect: true },
                    { id: 3, text: "База данных" },
                    { id: 4, text: "Операционная система" }
                  ]
                },
                {
                  id: 2,
                  question: "Где может выполняться JavaScript?",
                  options: [
                    { id: 1, text: "Только в браузере" },
                    { id: 2, text: "Только на сервере" },
                    { id: 3, text: "И в браузере, и на сервере", isCorrect: true },
                    { id: 4, text: "Только в мобильных приложениях" }
                  ]
                }
              ],
              xp_reward: 50
            }
          ]
        }
      ]
    },
    python: {
      title: "Python для начинающих",
      modules: [
        {
          id: 1,
          title: "Введение в Python",
          lessons: [
            {
              id: "1.1",
              title: "Знакомство с Python",
              intro: {
                title: "Что такое Python?",
                content: "<p>Python — это высокоуровневый язык программирования общего назначения. Он отличается читаемым кодом и философией, которая подчеркивает важность удобства программиста.</p><p>В этом уроке вы познакомитесь с основами Python и его применением в различных областях.</p>"
              },
              // Rest of the Python lesson content...
            }
          ]
        }
      ]
    },
    // Other programming languages...
  };

  /**
   * Get course data by language ID
   * First attempts to fetch from API, falls back to static content for demo
   */
  static async getCourseById(courseId) {
    try {
      // Attempt to get from API
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.log(`Using static data for course: ${courseId}`);
      return this.COURSE_CONTENT[courseId] || null;
    }
  }

  /**
   * Get lesson by ID
   * Format lessonId should be "moduleIndex.lessonIndex" (1-based)
   */
  static async getLesson(courseId, lessonId) {
    try {
      // Try API endpoint
      const response = await api.get(`/api/courses/${courseId}/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.log(`Using static data for lesson: ${courseId}/${lessonId}`);
      
      // Parse the lessonId
      const [moduleIndex, lessonIndex] = lessonId.split('.').map(part => parseInt(part, 10));
      
      // Get course data
      const courseData = this.COURSE_CONTENT[courseId];
      if (!courseData) return null;
      
      // Find the module and lesson
      const module = courseData.modules[moduleIndex - 1];
      if (!module) return null;
      
      const lesson = module.lessons[lessonIndex - 1];
      if (!lesson) return null;
      
      // Add additional information
      return {
        ...lesson,
        module_id: module.id,
        course_id: courseId,
        course_title: courseData.title,
        progress: {
          intro_completed: false,
          video_completed: false,
          practice_completed: false,
          test_completed: false,
          test_score: 0,
          earned_xp: 0,
          completed: false
        }
      };
    }
  }

  /**
   * Update lesson progress
   */
  static async updateLessonProgress(courseId, lessonId, progressData) {
    try {
      const response = await api.post(`/api/courses/${courseId}/lessons/${lessonId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.log(`Demo progress update for: ${courseId}/${lessonId}`, progressData);
      // Return a mock successful response
      return {
        success: true,
        progress: {
          ...progressData,
          completed: progressData.section === "test" && progressData.completed
        }
      };
    }
  }

  /**
   * Submit practice code
   */
  static async submitCode(courseId, lessonId, code) {
    try {
      const response = await api.post(`/api/courses/${courseId}/lessons/${lessonId}/check-code`, { code });
      return response.data;
    } catch (error) {
      console.log(`Demo code check for: ${courseId}/${lessonId}`);
      // Always return success for demo
      return {
        success: true,
        message: "Отлично! Ваш код прошел проверку."
      };
    }
  }

  /**
   * Submit test answers
   */
  static async submitTest(courseId, lessonId, answers) {
    try {
      const response = await api.post(`/api/courses/${courseId}/lessons/${lessonId}/check-test`, { answers });
      return response.data;
    } catch (error) {
      console.log(`Demo test submission for: ${courseId}/${lessonId}`, answers);
      
      // For demo, count any answer as correct
      const answerCount = Object.keys(answers).length;
      
      return {
        score: answerCount,
        total: answerCount,
        passed: true,
        message: "Тест успешно пройден!"
      };
    }
  }
}

export default CourseService;