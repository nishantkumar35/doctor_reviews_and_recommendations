import api from './axiosInstance';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (formData) => api.post('/auth/register', formData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  googleLogin: (token) => api.post('/auth/google-login', { token }),
};
