import axios from 'axios';

const apiAdminLogin = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://physiome-backend.onrender.com',
    // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

apiAdminLogin.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                if (window.location.pathname.includes('/admin')) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiAdminLogin;