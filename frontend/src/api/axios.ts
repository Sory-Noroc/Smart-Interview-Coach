import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081', // UAC
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
