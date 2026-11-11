import { useEffect, useState, type ReactNode } from 'react';
import type { LoginPayload, User } from '../types/auth.types';
import * as authApi from '../api/auth';
import { AuthContext } from './useAuth';

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

    const login = async (payload: LoginPayload): Promise<User> => {
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

    const refreshUser = async () => {
        setUser(await authApi.getMe());
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
