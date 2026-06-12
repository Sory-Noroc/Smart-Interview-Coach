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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor for token reinitialization
const responseErrorInterceptor = async (error: any) => {
    const originalRequest = error.config;

    // Intercept expired token errors for requests that haven't been retried yet
    if (error.response?.status === 403 && !originalRequest._retry && !originalRequest.url?.includes('/refresh')) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers.Authorization = 'Bearer ' + token;
                return axios(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token available');

            // Call the refresh endpoint using standard axios to avoid trigger interceptors again
            const response = await axios.post('http://localhost:8081/uac/v1/auth/refresh', {
                refreshToken: refreshToken
            });

            const newAccessToken = response.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
            return axios(originalRequest);
        } catch (err) {
            processQueue(err, null);
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
};

uacApi.interceptors.response.use(res => res, responseErrorInterceptor);
llmApi.interceptors.response.use(res => res, responseErrorInterceptor);

export default uacApi;
