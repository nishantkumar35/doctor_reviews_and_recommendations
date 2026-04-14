import api from './axiosInstance';

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  applyDoctor: (data) => api.post('/user/apply', data),
};
