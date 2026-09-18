import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [accessId, setAccessId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const authenticate = async (onSuccess: (mustChangePassword: boolean) => void) => {
        setError(null);
        setSubmitting(true);
        try {
            const user = await login({ id_usuario: accessId, password });
            onSuccess(user.must_change_password);
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? (err.response?.data?.detail ?? 'Cuenta o contraseña incorrecta')
                    : 'Ocurrió un error, intenta de nuevo'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        authenticate((mustChange) => {
            if (mustChange) window.alert('Debe cambiar la contraseña');
            navigate(mustChange ? '/cambio-password' : '/dashboard');
        });
    };

    const handleChangePasswordClick = () => {
        if (!accessId || !password) {
            setError('Ingresa tu cuenta y contraseña para cambiar tu password');
            return;
        }
        authenticate(() => navigate('/cambio-password'));
    };

    return (
        <div className="stc-login-page">
            <header className="stc-header">
                <button type="button" className="stc-exit-btn">
                    Salir
                </button>
                <div className="stc-header-accent" />
                <div className="stc-header-text" />
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-form-box">
                        <h1 className="stc-role-title">Rol para el personal de taquillas</h1>

                        <form onSubmit={handleSubmit}>
                            {[
                                { id: 'id_usuario', label: 'Cuenta de acceso', type: 'text', value: accessId, set: setAccessId, maxLength: 60 },
                                { id: 'password', label: 'Contraseña', type: 'password', value: password, set: setPassword },
                            ].map(({ id, label, set, ...input }) => (
                                <div className="stc-field-row" key={id}>
                                    <label className="stc-field-label" htmlFor={id}>
                                        {label}
                                    </label>
                                    <input
                                        id={id}
                                        className="stc-field-input"
                                        onChange={(e) => set(e.target.value.toUpperCase())}
                                        required
                                        {...input}
                                    />
                                </div>
                            ))}

                            {error && <p className="stc-error">{error}</p>}

                            <button type="submit" className="stc-submit-btn" disabled={submitting}>
                                {submitting ? 'Ingresando...' : 'Ingresar'}
                            </button>
                            <button
                                type="button"
                                className="stc-submit-btn"
                                onClick={handleChangePasswordClick}
                                disabled={submitting}
                            >
                                Cambiar Password
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
