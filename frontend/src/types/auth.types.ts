export interface RolVigente {
    id_rol_anual: number;
    nombre_rol: string;
    meses_q_califica: string | null;
    fecha_ini: string;
    fecha_fin: string;
    estatus_roldescansos: string | null;
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

export interface AuthTokens {
    access: string;
    refresh: string;
    user: User;
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
