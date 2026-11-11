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
    nombre: string | null;
    fecha_ingreso: string | null;
    prejubilacion: string | null;
    sexo: string | null;
}

export interface RolTaquilla {
    numero: number;
    id_expediente: number;
    id_tramo: string;
    faltas: number | null;
    id_taquilla: string;
    categoria: string;
    id_descansos: string;
    lugar: number;
    calificacion: string | number | null;
    turno: string;
    id_permanencia: number;
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

export interface RolDelAnio {
    anio: number;
    id_rol_anual: number;
    nombre_rol: string;
    meses_q_califica: string;
    fecha_ini: string;
    fecha_fin: string;
    estado: string | null;
}

export interface Catorcena {
    anio: number;
    id_catorcena: string;
    descrip123: string;
    mes: string;
    fecha_ini: string;
    fecha_fin: string;
    periodo: string;
    [dia: `dia${number}` | `idia${number}`]: string | null;
}

export interface PeriodoVacacional {
    anio: number;
    id_periodovac: string;
    fecha_ini: string | null;
    fecha_fin: string | null;
    periodo: string | null;
}

export interface Parametro {
    clave: number;
    puntos: number;
    [campo: string]: number;
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
export const getRolTaquilla = getRows<RolTaquilla>('rol-taquilla');
export const getSinCto = getRows<{ id_expediente: number; sincto: string }>('rol-taquilla/sincto');

export const createPermanencia = (data: Permanencia) => createRow('permanencias', data);
export const createLinea = (data: Linea) => createRow('lineas', data);
export const createEstacion = (data: Estacion) => createRow('estaciones', data);
export const createDescanso = (data: Descanso) => createRow('descansos', data);
export const createTaquilla = (data: Taquilla) => createRow('taquillas', data);
export const createPersonalTaquilla = (data: PersonalTaquilla, numero: number) =>
    createRow('personal-taquilla', { ...data, numero });
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

const parametroApi = (collection: string) => {
    const get = getRows<Parametro>(collection);
    return {
        get: async () =>
            (await get()).map(
                (p) => Object.fromEntries(Object.entries(p).map(([key, value]) => [key, Math.round(value * 100) / 100])) as Parametro
            ),
        create: (data: Parametro) => createRow(collection, data),
        update: (data: Parametro) => updateRow([collection, data.clave], data),
        remove: (data: Parametro) => deleteRow(collection, data.clave),
    };
};

export type ParametroApi = ReturnType<typeof parametroApi>;

export const antiguedadStcApi = parametroApi('antiguedad-stc');
export const asistenciaApi = parametroApi('asistencia');
export const puntualidadApi = parametroApi('puntualidad');
export const rolesLineaTurnoApi = parametroApi('roles-linea-turno');
export const faltanteEfectivoApi = parametroApi('faltante-efectivo');
export const frecuenciaFeApi = parametroApi('frecuencia-fe');
export const sancionesApi = parametroApi('sanciones');

export const getRolesDelAnio = getRows<RolDelAnio>('roles-del-anio');
export const createRolDelAnio = (data: RolDelAnio) => createRow('roles-del-anio', data);
export const updateRolDelAnio = (data: RolDelAnio) => updateRow(['roles-del-anio', data.anio, data.id_rol_anual], data);
export const deleteRolDelAnio = (data: RolDelAnio) => deleteRow('roles-del-anio', data.anio, data.id_rol_anual);
export const getCatorcenas = getRows<Catorcena>('catorcenas');
export const createCatorcena = (data: Catorcena) => createRow('catorcenas', data);
export const updateCatorcena = (data: Catorcena) => updateRow(['catorcenas', data.anio, data.id_catorcena], data);
export const deleteCatorcena = (data: Catorcena) => deleteRow('catorcenas', data.anio, data.id_catorcena);
export const getPeriodosVacacionales = getRows<PeriodoVacacional>('periodos-vacacionales');
export const createPeriodoVacacional = (data: PeriodoVacacional) => createRow('periodos-vacacionales', data);
export const updatePeriodoVacacional = (data: PeriodoVacacional) =>
    updateRow(['periodos-vacacionales', data.anio, data.id_periodovac], data);
export const deletePeriodoVacacional = (data: PeriodoVacacional) => deleteRow('periodos-vacacionales', data.anio, data.id_periodovac);
export const cambiaRolVigente = async ({ anio, id_rol_anual }: RolDelAnio): Promise<void> => {
    await api.post('/roles-del-anio/cambia-vigente/', { anio, id_rol_anual });
};

export const respaldaRolVigente = async () => (await api.post<{ respaldados: number }>('/rol-taquilla/respalda/')).data.respaldados;

export const calificaProvisional = async () => (await api.post<{ updated: number }>('/personal-gaceta/califica/')).data.updated;

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
