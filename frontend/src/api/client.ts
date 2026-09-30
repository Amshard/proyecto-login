import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:8000/api';

export const clearTokens = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
};

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token available');
    const { data } = await axios.post<{ access: string }>(`${API_URL}/auth/refresh/`, { refresh });
    localStorage.setItem('access', data.access);
    return data.access;
}

// Axios instance that sends the access token and retries once with a refreshed one on 401.
export function createApi(path: string) {
    const api = axios.create({ baseURL: `${API_URL}/${path}` });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('access');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    refreshPromise ??= refreshAccessToken().finally(() => {
                        refreshPromise = null;
                    });
                    const access = await refreshPromise;
                    originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${access}` };
                    return api(originalRequest);
                } catch {
                    clearTokens();
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
}
