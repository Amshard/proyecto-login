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

export interface PersonalRespaldo {
    id_expediente: number;
    fecha_ingreso: string;
}

export const getPersonalRespaldo = async (): Promise<PersonalRespaldo[]> => {
    const { data } = await api.get<PersonalRespaldo[]>('/personal-respaldo/');
    return data;
};

export interface PersonalGaceta {
    exp: number;
    permiso: string | null;
    fecha: string | null;
}

export const getPersonalGaceta = async (): Promise<PersonalGaceta[]> => {
    const { data } = await api.get<PersonalGaceta[]>('/personal-gaceta/');
    return data;
};

export interface Taquilla {
    id_taquilla: string;
    turno: string;
    dirdelinea: number;
    extension_tel: string | null;
    id_linea: string;
    id_estacion: string;
    direccion?: string | null;
}

export const getTaquillas = async (): Promise<Taquilla[]> => {
    const { data } = await api.get<Taquilla[]>('/taquillas/');
    return data;
};

export default api;

const itemUrl = (path: (string | number)[]) => `/${path.map((part) => encodeURIComponent(String(part))).join('/')}/`;

// Inserts a catalog row; the backend stamps usuario_alta / fecha_alta and leaves the modif columns NULL.
const createRow = async (collection: string, data: object): Promise<void> => {
    await api.post(`/${collection}/`, data);
};

export const createPermanencia = (data: Permanencia) => createRow('permanencias', data);
export const createLinea = (data: Linea) => createRow('lineas', data);
export const createEstacion = (data: Estacion) => createRow('estaciones', data);
export const createDescanso = (data: Descanso) => createRow('descansos', data);
export const createTaquilla = (data: Taquilla) => createRow('taquillas', data);
export const createPersonalTaquilla = (data: PersonalTaquilla) => createRow('personal-taquilla', data);
export const createPersonalGaceta = (data: PersonalGaceta) => createRow('personal-gaceta', data);

// Updates a catalog row by its key; the backend stamps usuario_modif / fecha_modif.
const updateRow = async (path: (string | number)[], data: object): Promise<void> => {
    await api.put(itemUrl(path), data);
};

// Deletes a catalog row by its key; the backend refuses (409) when the id is still referenced.
const deleteRow = async (...path: (string | number)[]): Promise<void> => {
    await api.delete(itemUrl(path));
};

export const updatePermanencia = (data: Permanencia) => updateRow(['permanencias', data.id_permanencia], data);
export const updateLinea = (data: Linea) => updateRow(['lineas', data.id_linea], data);
export const updateEstacion = (data: Estacion) => updateRow(['estaciones', data.id_linea, data.id_estacion], data);
export const updateDescanso = (data: Descanso) => updateRow(['descansos', data.id_descansos], data);
export const updateTaquilla = (data: Taquilla) => updateRow(['taquillas', data.id_taquilla, data.turno], data);
export const updatePersonalTaquilla = (data: PersonalTaquilla) =>
    updateRow(['personal-taquilla', data.id_expediente], data);
export const updatePersonalGaceta = (data: PersonalGaceta) => updateRow(['personal-gaceta', data.exp], data);

export const deletePermanencia = (id: string) => deleteRow('permanencias', id);
export const deleteLinea = (id: string) => deleteRow('lineas', id);
export const deleteEstacion = (idLinea: string, idEstacion: string) => deleteRow('estaciones', idLinea, idEstacion);
export const deleteDescanso = (id: string) => deleteRow('descansos', id);
export const deleteTaquilla = (id: string, turno: string) => deleteRow('taquillas', id, turno);
export const deletePersonalTaquilla = (expediente: number) => deleteRow('personal-taquilla', expediente);
export const deletePersonalGaceta = (exp: number) => deleteRow('personal-gaceta', exp);

export const isNotFound = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 404;

export function apiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as Record<string, unknown> | undefined;
        if (typeof data?.detail === 'string') return data.detail;
        // Field validation errors: { campo: ['mensaje', ...] }
        const [field, messages] = Object.entries(data ?? {})[0] ?? [];
        if (field && Array.isArray(messages)) return `${field}: ${messages.join(' ')}`;
    }
    return fallback;
}
