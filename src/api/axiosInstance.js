import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Inject token into every request if it exists.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Normalize successful responses and centralize error handling.
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }

        if (status === 429) {
            console.warn('Too many requests. Please try again later.');
        }

        const normalizedError = {
            status: status || 500,
            message:
                error.response?.data?.message ||
                error.message ||
                'Something went wrong.',
            data: error.response?.data || null,
        };

        return Promise.reject(normalizedError);
    }
);

export default axiosInstance;
