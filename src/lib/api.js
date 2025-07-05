import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://physiome-backend.onrender.com/api',
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const appointments = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export const patients = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
};

export const exercises = {
  create: (data) => api.post('/exercises', data),
  getAll: () => api.get('/exercises'),
  getById: (id) => api.get(`/exercises/${id}`),
  update: (id, data) => api.put(`/exercises/${id}`, data),
  delete: (id) => api.delete(`/exercises/${id}`),
};

export const treatmentPlans = {
  create: (data) => api.post('/treatment-plans', data),
  getAll: () => api.get('/treatment-plans'),
  getById: (id) => api.get(`/treatment-plans/${id}`),
  update: (id, data) => api.put(`/treatment-plans/${id}`, data),
  delete: (id) => api.delete(`/treatment-plans/${id}`),
};

export const progress = {
  create: (data) => api.post('/progress', data),
  getAll: () => api.get('/progress'),
  getById: (id) => api.get(`/progress/${id}`),
  update: (id, data) => api.put(`/progress/${id}`, data),
};

export const therapists = {
  getApproved: () => api.get('/therapists/approved'),
  getById: (id) => api.get(`/therapists/${id}`),
  updateProfile: (id, data) => api.put(`/therapists/${id}/profile`, data),
};

export default api; 