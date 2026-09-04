import axios from 'axios';
import type { LoginPayload, AuthTokens, User, RegisterPayload } from '../types/auth.types';

const api = axios.create({
    baseURL: 'http://localhost:800/api/auth'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) config.headers.Authorization = ` ${token}`;
    return config;
});

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

export default api;
