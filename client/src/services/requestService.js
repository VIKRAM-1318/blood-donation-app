import api from './api';

export const getRequests = (params = {}) => {
  return api.get('/requests', { params });
};

export const getRequestById = (id) => {
  return api.get(`/requests/${id}`);
};

export const createRequest = (data) => {
  return api.post('/requests', data);
};

export const updateRequestStatus = (id, status) => {
  return api.patch(`/requests/${id}/status`, { status });
};
