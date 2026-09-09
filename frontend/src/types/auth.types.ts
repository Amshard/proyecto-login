export interface RolVigente {
    nombre_rol: string;
    meses_q_califica: string | null;
    fecha_ini: string;
    fecha_fin: string;
}

export interface User {
    id_usuario: string;
    nombre: string;
    must_change_password: boolean;
    fecha_modif: string | null;
    rol_vigente: RolVigente | null;
}

export interface LoginPayload {
    id_usuario: string;
    password: string;
}

export interface RegisterPayload {
    id_usuario: string;
    nombre: string;
    password: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
    user: User;
}
