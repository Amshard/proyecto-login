import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
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
                {/* TODO: image banner placeholder - <img className="stc-header-banner" src="..." alt="Banner" /> */}
                <div className="stc-header-text">
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-form-box">
                        <h1 className="stc-role-title">Rol para el personal de taquillas</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="stc-field-row">
                                <label className="stc-field-label" htmlFor="email">
                                    Cuenta de acceso
                                </label>
                                <input
                                    id="email"
                                    className="stc-field-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p className="stc-error">{error}</p>}

                            <button type="submit" className="stc-submit-btn" disabled={submitting}>
                                {submitting ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
