import type { AuthTokens, ChangePasswordPayload, LoginPayload, User } from '../types/auth.types';
import { createApi } from './client';

export { clearTokens } from './client';

const api = createApi('auth');

export const login = async (payload: LoginPayload): Promise<AuthTokens> => (await api.post<AuthTokens>('/login/', payload)).data;

export const getMe = async (): Promise<User> => (await api.get<User>('/me/')).data;

export const logout = async (): Promise<void> => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return;
    await api.post('/logout/', { refresh }).catch(() => {});
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<void> => {
    await api.post('/change-password/', payload);
};

export interface Usuario {
    id_usuario: string;
    nombre: string;
    estatus: string;
    tipo_usuario: string;
    descri_usuario: string | null;
    password?: string;
    fecha_alta: string | null;
    fecha_baja: string | null;
    fecha_modif: string | null;
}

const usuarioUrl = (id: string) => `/usuarios/${encodeURIComponent(id)}/`;

export const getUsuarios = async (): Promise<Usuario[]> => (await api.get<Usuario[]>('/usuarios/')).data;

export const createUsuario = async (data: Usuario): Promise<void> => {
    await api.post('/usuarios/', data);
};

export const updateUsuario = async (data: Usuario): Promise<void> => {
    await api.put(usuarioUrl(data.id_usuario), data);
};

export const deleteUsuario = async (id: string): Promise<void> => {
    await api.delete(usuarioUrl(id));
};
