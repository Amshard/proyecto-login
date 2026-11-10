import { createContext, useContext } from 'react';
import type { LoginPayload, User } from '../types/auth.types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<User>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
