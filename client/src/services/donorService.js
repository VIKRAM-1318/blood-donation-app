import api from './api';

export const getDonors = (params = {}) => {
  return api.get('/donors', { params });
};

export const getDonorById = (id) => {
  return api.get(`/donors/${id}`);
};

export const createDonor = (data) => {
  return api.post('/donors', data);
};

export const updateDonor = (id, data) => {
  return api.put(`/donors/${id}`, data);
};

export const updateDonorStatus = (id, status) => {
  return api.patch(`/donors/${id}/status`, { status });
};
