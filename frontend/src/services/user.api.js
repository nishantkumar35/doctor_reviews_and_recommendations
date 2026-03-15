import api from './axiosInstance';

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  applyDoctor: (data) => api.post('/user/apply', data),
};
