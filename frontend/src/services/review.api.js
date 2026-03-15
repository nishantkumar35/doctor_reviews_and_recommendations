import api from './axiosInstance';

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
