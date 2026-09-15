import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8000/api/catalogos';

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
    const { data } = await axios.post<{ access: string }>('http://localhost:8000/api/auth/refresh/', { refresh });
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

export interface Permanencia {
    id_permanencia: string;
    nombre_perma: string;
    descripcion: string;
    siglas: string;
}

export const getPermanencias = async (): Promise<Permanencia[]> => {
    const { data } = await api.get<Permanencia[]>('/permanencias/');
    return data;
};

export interface Linea {
    id_linea: string;
    dirdelinea1: number;
    nombre_dirlin1: string;
    dirdelinea2: number;
    nombre_dirlin2: string;
    estaciones: number | null;
    taquillas: number | null;
    tramos: number | null;
    id_permanencia: string | null;
}

export const getLineas = async (): Promise<Linea[]> => {
    const { data } = await api.get<Linea[]>('/lineas/');
    return data;
};

export interface Estacion {
    id_linea: string;
    id_estacion: string;
    nombre_estacion: string;
}

export const getEstaciones = async (): Promise<Estacion[]> => {
    const { data } = await api.get<Estacion[]>('/estaciones/');
    return data;
};

export interface Descanso {
    id_descansos: string;
    iniciales: string;
    descanso1: string;
    descanso2: string;
}

export const getDescansos = async (): Promise<Descanso[]> => {
    const { data } = await api.get<Descanso[]>('/descansos/');
    return data;
};

export interface PersonalTaquilla {
    id_expediente: number;
    nombre: string;
    fecha_ingreso: string;
    prejubilacion: string;
    sexo: string;
}

export const getPersonalTaquilla = async (): Promise<PersonalTaquilla[]> => {
    const { data } = await api.get<PersonalTaquilla[]>('/personal-taquilla/');
    return data;
};

export interface Taquilla {
    id_taquilla: string;
    turno: string;
    dirdelinea: number;
    extension_tel: string | null;
    id_linea: string;
    id_estacion: string;
}

export const getTaquillas = async (): Promise<Taquilla[]> => {
    const { data } = await api.get<Taquilla[]>('/taquillas/');
    return data;
};

export default api;
