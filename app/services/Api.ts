import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "~/utils/cookies";

const baseURL = import.meta.env.VITE_API_URL || "https://api.gohappygo.fr/api";

const api = axios.create({
    baseURL,
});

// Variable to track if we're currently refreshing the token
let isRefreshing = false;
// Queue of failed requests waiting for token refresh
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

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

// Request interceptor - Attach auth token
api.interceptors.request.use((config) => {
    const token = getCookie('auth_token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor - Handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // If we're already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getCookie('refresh_token');

        if (!refreshToken) {
            // No refresh token available, clear auth and reject
            deleteCookie('auth_token');
            deleteCookie('refresh_token');
            processQueue(error, null);
            isRefreshing = false;
            
            // Redirect to login or trigger logout
            if (typeof window !== "undefined") {
                window.location.href = '/';
            }
            
            return Promise.reject(error);
        }

        try {
            // Call refresh token endpoint
            const response = await axios.post(`${baseURL}/auth/refresh-token`, {
                refreshToken
            });

            const { access_token } = response.data;

            // Update cookies with new token
            setCookie('auth_token', access_token, 7);

            // Update the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            // Process queued requests
            processQueue(null, access_token);
            isRefreshing = false;

            // Retry the original request
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed, clear auth and reject all queued requests
            deleteCookie('auth_token');
            deleteCookie('refresh_token');
            processQueue(refreshError, null);
            isRefreshing = false;

            // Redirect to login
            if (typeof window !== "undefined") {
                window.location.href = '/';
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;