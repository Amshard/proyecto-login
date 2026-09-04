import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { LoginPayload, AuthTokens, User, RegisterPayload } from '../types/auth.types';

const BASE_URL = 'http://localhost:8000/api/auth';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token available');
    const { data } = await axios.post<{ access: string }>(`${BASE_URL}/refresh/`, { refresh });
    localStorage.setItem('access', data.access);
    return data.access;
}

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
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
        }
        return Promise.reject(error);
    }
);

export const login = async (payload: LoginPayload): Promise<AuthTokens> => {
    const { data } = await api.post<AuthTokens>('/login/', payload);
    return data;
};

export const register = async (payload: RegisterPayload): Promise<User> => {
    const { data } = await api.post<User>('/register/', payload);
    return data;
};

export const getMe = async (): Promise<User> => {
    const { data } = await api.get<User>('/me/');
    return data;
};

export const logout = async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    try {
        await api.post('/logout/', { refresh });
    } catch {
        // token may already be expired/blacklisted; nothing to do
    }
};

export default api;
