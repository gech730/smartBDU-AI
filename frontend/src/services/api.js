import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history')
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  getByName: (name) => api.get(`/departments/name/${name}`),
  search: (q) => api.get(`/departments/search?q=${q}`),
  getRecommendations: (data) => api.post('/departments/recommend', data)
};

export const roadmapAPI = {
  generate: (data) => api.post('/roadmap/generate', data),
  create: (data) => api.post('/roadmap', data),
  getAll: () => api.get('/roadmap'),
  getById: (id) => api.get(`/roadmap/${id}`),
  delete: (id) => api.delete(`/roadmap/${id}`)
};

export const careerAPI = {
  getCVTips: (targetRole) => api.post('/career/cv-tips', { targetRole }),
  getInterviewPrep: (targetRole) => api.post('/career/interview-prep', { targetRole })
};

export const analyticsAPI = {
  trackEvent: (data) => api.post('/analytics/track', data),
  getUserAnalytics: () => api.get('/analytics/user'),
  getAdminAnalytics: () => api.get('/analytics/admin')
};

export const cvAPI = {
  generate: (data) => api.post('/cv/generate', data),
  getTemplates: () => api.get('/cv/templates')
};

export const careerRecommendAPI = {
  getRecommendations: (data) => api.post('/career-recommend/recommend', data),
  getDepartmentPaths: (id) => api.get(`/career-recommend/department/${id}`),
  getAllCareers: () => api.get('/career-recommend/all')
};

export default api;