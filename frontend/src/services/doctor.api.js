import api from './axiosInstance';

export const doctorAPI = {
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (formData) => api.put('/doctor/update', formData),
  getAll: () => api.get('/doctor/all'),
  getSingle: (id) => api.get(`/doctor/${id}`),
  getSimilarDoctors: (id) => api.get(`/doctor/similar/${id}`),
};
