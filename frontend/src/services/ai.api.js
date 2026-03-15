import api from './axiosInstance';

export const aiAPI = {
  search: (problem) => api.post('/ai/search', { problem }),
};
