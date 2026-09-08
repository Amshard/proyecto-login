export interface User {
    id_usuario: string;
    nombre: string;
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
