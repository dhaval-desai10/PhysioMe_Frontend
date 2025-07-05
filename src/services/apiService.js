import axios from 'axios';

const API_URL = 'https://physiome-backend.onrender.com/api';

// Configure axios
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Appointment Services
export const appointmentService = {
  createAppointment: async (appointmentData) => {
    const response = await axios.post('/appointments', appointmentData);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await axios.get('/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await axios.put(`/appointments/${appointmentId}/status`, { status });
    return response.data;
  },

  getAvailableTimeSlots: async (therapistId, date) => {
    const response = await axios.get('/appointments/available-slots', {
      params: { therapistId, date }
    });
    return response.data;
  }
};

// Exercise Services
export const exerciseService = {
  createExercise: async (formData) => {
    const response = await axios.post('/exercises', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getExercises: async (filters = {}) => {
    const response = await axios.get('/exercises', { params: filters });
    return response.data;
  },

  getExerciseById: async (id) => {
    const response = await axios.get(`/exercises/${id}`);
    return response.data;
  },

  updateExercise: async (id, formData) => {
    const response = await axios.put(`/exercises/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteExercise: async (id) => {
    const response = await axios.delete(`/exercises/${id}`);
    return response.data;
  }
};

// Treatment Plan Services
export const treatmentPlanService = {
  createTreatmentPlan: async (planData) => {
    const response = await axios.post('/treatment-plans', planData);
    return response.data;
  },

  getTreatmentPlans: async () => {
    const response = await axios.get('/treatment-plans');
    return response.data;
  },

  getTreatmentPlanById: async (id) => {
    const response = await axios.get(`/treatment-plans/${id}`);
    return response.data;
  },

  updateTreatmentPlan: async (id, planData) => {
    const response = await axios.put(`/treatment-plans/${id}`, planData);
    return response.data;
  },

  deleteTreatmentPlan: async (id) => {
    const response = await axios.delete(`/treatment-plans/${id}`);
    return response.data;
  }
};

// Progress Services
export const progressService = {
  createProgress: async (formData) => {
    const response = await axios.post('/progress', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getProgressHistory: async (filters = {}) => {
    const response = await axios.get('/progress', { params: filters });
    return response.data;
  },

  updateProgress: async (id, formData) => {
    const response = await axios.put(`/progress/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getProgressStats: async (treatmentPlanId) => {
    const response = await axios.get(`/progress/stats/${treatmentPlanId}`);
    return response.data;
  }
};

// Error Handler
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);