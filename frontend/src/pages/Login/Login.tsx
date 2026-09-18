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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const loggedInUser = await login({ id_usuario: accessId, password });
            if (loggedInUser.must_change_password) {
                window.alert('Debe cambiar la contraseña');
                navigate('/cambio-password');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            const message = axios.isAxiosError(err)
                ? (err.response?.data?.detail ?? 'Cuenta o contraseña incorrecta')
                : 'Ocurrió un error, intenta de nuevo';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePasswordClick = async () => {
        if (!accessId || !password) {
            setError('Ingresa tu cuenta y contraseña para cambiar tu password');
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            await login({ id_usuario: accessId, password });
            navigate('/cambio-password');
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? (err.response?.data?.detail ?? 'Cuenta o contraseña incorrecta')
                : 'Ocurrió un error, intenta de nuevo';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                <button type="button" className="stc-exit-btn">
                    Salir
                </button>
                <div className="stc-header-accent" />
                {/*<img className="stc-header-banner" src="..." alt="Banner" /> */}
                <div className="stc-header-text">
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-form-box">
                        <h1 className="stc-role-title">Rol para el personal de taquillas</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="stc-field-row">
                                <label className="stc-field-label" htmlFor="id_usuario">
                                    Cuenta de acceso
                                </label>
                                <input
                                    id="id_usuario"
                                    className="stc-field-input"
                                    type="text"
                                    maxLength={60}
                                    value={accessId}
                                    onChange={(e) => setAccessId(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>

                            <div className="stc-field-row">
                                <label className="stc-field-label" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    className="stc-field-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value.toUpperCase())}
                                    required
                                />
                            </div>

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
