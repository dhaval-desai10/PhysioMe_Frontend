import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://physiome-backend.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear auth data and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');

//       // Only redirect if not already on login page
//       if (!window.location.pathname.includes('/login')) {
//         if (window.location.pathname.includes('/admin')) {
//           window.location.href = '/admin';
//         } else {
//           window.location.href = '/login';
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// Admin API endpoints
export const adminApi = {
  getAllTherapists: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/admin/therapists');
  },

  getAllPatients: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/admin/patients');
  },

  getPatientDetails: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }
    return api.get(`/admin/patients/${id}`);
  },

  getDashboardStats: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/admin/dashboard/stats');
  },

  getPendingTherapists: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/admin/therapist-approvals');
  },

  getTherapistDetails: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.get(`/admin/therapist-approvals/${id}`);
  },

  approveTherapist: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.put(`/admin/therapist-approvals/${id}/approve`);
  },

  rejectTherapist: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.put(`/admin/therapist-approvals/${id}/reject`);
  },

  deleteTherapist: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    // Use the universal user management route
    return api.post(`/admin/users/${id}/manage`, {
      action: 'DELETE',
      userType: 'therapist'
    });
  },

  deletePatient: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }
    // Use the universal user management route
    return api.post(`/admin/users/${id}/manage`, {
      action: 'DELETE',
      userType: 'patient'
    });
  }
};

// Auth API endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Not authenticated'));
    }
    return api.post('/auth/logout');
  },
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Not authenticated'));
    }
    return api.get('/auth/me');
  }
};

// Therapist API endpoints
export const therapistApi = {
  getProfile: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.get(`/therapist/${id}/profile`);
  },
  updateProfile: (id, data, config = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }

    // Create a custom instance for this request to handle FormData
    const formDataInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://physiome-backend.onrender.com/api',
      withCredentials: true,
      timeout: 60000, // 60 second timeout for uploads
    });

    // Add auth token and ensure proper content type
    formDataInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;

        // Handle FormData
        if (data instanceof FormData) {
          // Important: Remove Content-Type header to let the browser set it with boundary
          delete config.headers['Content-Type'];
          // Verify FormData is not empty
          if (Array.from(data.entries()).length === 0) {
            // Add a dummy field to prevent empty FormData
            data.append('_dummy', 'true');
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for better error handling
    formDataInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return formDataInstance.put(`/therapist/${id}/profile`, data);
  },
  getAppointments: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.get(`/therapist/${id}/appointments`);
  },
  getPatients: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.get(`/therapist/${id}/patients`);
  },
  bookAppointment: (therapistId, appointmentData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!therapistId) {
      return Promise.reject(new Error('Therapist ID is required'));
    }
    return api.post(`/therapist/${therapistId}/appointments`, appointmentData);
  },
  getAvailabilitySlots: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/therapist/availability');
  }
};

// Patient API endpoints
export const patientApi = {
  getProfile: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }
    return api.get(`/patient/profile/${id}`);
  },
  updateProfile: (id, data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }

    // For FormData, we need to remove the default Content-Type header
    // so the browser can set it automatically with the correct boundary
    const config = {};
    if (data instanceof FormData) {
      config.headers = {
        'Content-Type': undefined,
      };
    }

    return api.put(`/patient/profile/${id}`, data, config);
  },
  getAppointments: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }
    return api.get(`/patient/${id}/appointments`);
  },
  // Get appointments for authenticated user (no ID needed)
  getMyAppointments: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/patient/appointments');
  },
  getTreatmentPlans: (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    if (!id) {
      return Promise.reject(new Error('Patient ID is required'));
    }
    return api.get(`/patient/${id}/treatment-plans`);
  },
  getApprovedTherapists: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get('/therapists/approved', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getAvailableSlots: (therapistId, date) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.get(`/therapists/${therapistId}/available-slots/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  createAppointment: (appointmentData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject(new Error('Authentication required'));
    }
    return api.post('/appointments', appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};

export default api;