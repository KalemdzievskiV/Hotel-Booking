import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    },
});

// Add request interceptor to ensure consistent content type
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Ensure content type is set correctly for POST and PUT requests
        if (config.method === 'post' || config.method === 'put') {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
