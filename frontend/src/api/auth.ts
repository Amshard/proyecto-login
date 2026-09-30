import type { AuthTokens, ChangePasswordPayload, LoginPayload, User } from '../types/auth.types';
import { createApi } from './client';

export { clearTokens } from './client';

const api = createApi('auth');

export const login = async (payload: LoginPayload): Promise<AuthTokens> => (await api.post<AuthTokens>('/login/', payload)).data;

export const getMe = async (): Promise<User> => (await api.get<User>('/me/')).data;

export const logout = async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    try {
        await api.post('/logout/', { refresh });
    } catch {
    }
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    await api.post('/change-password/', payload);
};
