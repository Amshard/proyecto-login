import axios from 'axios';
import { createApi } from './client';

const api = createApi('catalogos');

export interface Permanencia {
    id_permanencia: string;
    nombre_perma: string;
    descripcion: string;
    siglas: string;
}

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

export interface Estacion {
    id_linea: string;
    id_estacion: string;
    nombre_estacion: string;
}

export interface Descanso {
    id_descansos: string;
    iniciales: string;
    descanso1: string;
    descanso2: string;
}

export interface PersonalTaquilla {
    id_expediente: number;
    nombre: string;
    fecha_ingreso: string;
    prejubilacion: string;
    sexo: string;
}

export interface PersonalGaceta {
    exp: number;
    permiso: string | null;
    fecha: string | null;
}

export interface Taquilla {
    id_taquilla: string;
    turno: string;
    dirdelinea: number;
    extension_tel: string | null;
    id_linea: string;
    id_estacion: string;
}

type Key = string | number;

const itemUrl = (path: Key[]) => `/${path.map((part) => encodeURIComponent(String(part))).join('/')}/`;

const getRows = <T>(collection: string) => async () => (await api.get<T[]>(`/${collection}/`)).data;

const createRow = async (collection: string, data: object): Promise<void> => {
    await api.post(`/${collection}/`, data);
};

const updateRow = async (path: Key[], data: object): Promise<void> => {
    await api.put(itemUrl(path), data);
};

const deleteRow = async (...path: Key[]): Promise<void> => {
    await api.delete(itemUrl(path));
};

export const getPermanencias = getRows<Permanencia>('permanencias');
export const getLineas = getRows<Linea>('lineas');
export const getEstaciones = getRows<Estacion>('estaciones');
export const getDescansos = getRows<Descanso>('descansos');
export const getTaquillas = getRows<Taquilla>('taquillas');
export type TaquillaOperacion = Pick<Taquilla, 'id_taquilla' | 'turno'> & { linea: string; nombre_estacion: string };
export const getTaquillasOperacion = getRows<TaquillaOperacion>('taquillas/operacion');
export const getPersonalTaquilla = getRows<PersonalTaquilla>('personal-taquilla');
export const getPersonalGaceta = getRows<PersonalGaceta>('personal-gaceta');

export const createPermanencia = (data: Permanencia) => createRow('permanencias', data);
export const createLinea = (data: Linea) => createRow('lineas', data);
export const createEstacion = (data: Estacion) => createRow('estaciones', data);
export const createDescanso = (data: Descanso) => createRow('descansos', data);
export const createTaquilla = (data: Taquilla) => createRow('taquillas', data);
export const createPersonalTaquilla = (data: PersonalTaquilla) => createRow('personal-taquilla', data);
export const createPersonalGaceta = (data: PersonalGaceta) => createRow('personal-gaceta', data);

export const updatePermanencia = (data: Permanencia) => updateRow(['permanencias', data.id_permanencia], data);
export const updateLinea = (data: Linea) => updateRow(['lineas', data.id_linea], data);
export const updateEstacion = (data: Estacion) => updateRow(['estaciones', data.id_linea, data.id_estacion], data);
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
        const [field, messages] = Object.entries(data ?? {})[0] ?? [];
        if (field && Array.isArray(messages)) return `${field}: ${messages.join(' ')}`;
    }
    return fallback;
}
