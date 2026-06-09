import axios from 'axios';

export const uacApi = axios.create({
    baseURL: 'http://localhost:8081', // UAC
});

export const llmApi = axios.create({
    baseURL: 'http://localhost:8080', // UserContextualizer
});

const tokenInterceptor = (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
        } else {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
};

// Token Interceptor
uacApi.interceptors.request.use(tokenInterceptor);
llmApi.interceptors.request.use(tokenInterceptor);

export default uacApi;
