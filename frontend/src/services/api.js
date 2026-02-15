import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set the Authorization header globally if token exists
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (formData) => api.post('/auth/register', formData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  googleLogin: (token) => api.post('/auth/google-login', { token }),
};

// Doctor API
export const doctorAPI = {
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (formData) => api.put('/doctor/update', formData),
  getAll: () => api.get('/doctor/all'),
  getSingle: (id) => api.get(`/doctor/${id}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  applyDoctor: (data) => api.post('/user/apply', data),
};

// Review API
export const reviewAPI = {
  add: (data) => api.post('/review/add', data),
  edit: (data) => api.post('/review/edit', data),
  remove: (id) => api.delete(`/review/delete/${id}`),
  addReply: (data) => api.post('/review/reply/add', data),
  editReply: (data) => api.post('/review/reply/edit', data),
  removeReply: (reviewId, replyId) => api.delete(`/review/reply/delete/${reviewId}/${replyId}`),
  getDoctorReviews: () => api.get('/review/doctor/reviews'),
  getUserReviews: () => api.get('/review/user/reviews'),
  getForDoctor: (id) => api.get(`/review/reviews/${id}`),
};

// AI API
export const aiAPI = {
  search: (problem) => api.post('/ai/search', { problem }),
};

export default api;
