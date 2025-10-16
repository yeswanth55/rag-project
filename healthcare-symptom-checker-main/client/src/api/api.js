import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Symptom APIs
export const analyzeSymptoms = (data) => api.post('/symptoms/analyze', data);
export const getHistory = () => api.get('/symptoms/history');
export const getConsultation = (id) => api.get(`/symptoms/history/${id}`);
export const deleteConsultation = (id) => api.delete(`/symptoms/history/${id}`);
export const getStats = () => api.get('/symptoms/stats');

export default api;
