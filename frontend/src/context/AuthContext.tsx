import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginPayload, RegisterPayload, User } from '../types/auth.types';
import * as authApi from '../api/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const access = localStorage.getItem('access');
        if (!access) {
            setLoading(false);
            return;
        }
        authApi
            .getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (payload: LoginPayload) => {
        const data = await authApi.login(payload);
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setUser(data.user);
    };

    const register = async (payload: RegisterPayload) => {
        await authApi.register(payload);
        await login({ email: payload.email, password: payload.password });
    };

    const logout = async () => {
        await authApi.logout();
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
