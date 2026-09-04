export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
export interface AuthTokens {
    access: string;
    refresh: string;
}
export interface RegisterPayload {
    access: string;
    refresh: string;
}