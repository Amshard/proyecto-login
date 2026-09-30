import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginPayload, User } from '../types/auth.types';
import * as authApi from '../api/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(() => localStorage.getItem('access') !== null);

    useEffect(() => {
        if (!localStorage.getItem('access')) return;
        authApi
            .getMe()
            .then(setUser)
            .catch(authApi.clearTokens)
            .finally(() => setLoading(false));
    }, []);

    const login = async (payload: LoginPayload) => {
        const data = await authApi.login(payload);
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setUser(data.user);
        return data.user;
    };

    const logout = async () => {
        await authApi.logout();
        authApi.clearTokens();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
