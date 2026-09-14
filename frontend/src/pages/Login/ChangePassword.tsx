import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { changePassword } from '../api/auth';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        changePassword({
             current_password: currentPassword,
             new_password: newPassword,
             confirm_password: confirmPassword,
         })
             .then(() => navigate('/dashboard'))
             .catch((err) => {
                 const message = axios.isAxiosError(err)
                     ? (err.response?.data?.current_password?.[0]
                         ?? err.response?.data?.new_password?.[0]
                         ?? err.response?.data?.non_field_errors?.[0]
                         ?? err.response?.data?.detail
                         ?? 'No se pudo cambiar la contraseña')
                     : 'Ocurrió un error, intenta de nuevo';
                 setError(message);
             });
    };

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                <button
                    type="button"
                    className="stc-exit-btn"
                    onClick={() => navigate('/login', { replace: true })}
                >
                    Salir
                </button>
                <div className="stc-header-accent" />
                <div className="stc-header-text">
                    COORDINACIÓN DE TAQUILLA
                    <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-content-square stc-changepw-box">
                            <div className="stc-changepw-titlebar">Cambio de Password</div>

                            <div className="stc-changepw-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="stc-field-row">
                                        <label className="stc-field-label" htmlFor="current_password">
                                            Password actual
                                        </label>
                                        <input
                                            id="current_password"
                                            className="stc-field-input"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {error && <p className="stc-error">{error}</p>}

                                    <div className="stc-field-row">
                                        <label className="stc-field-label" htmlFor="new_password">
                                            Nuevo Password
                                        </label>
                                        <input
                                            id="new_password"
                                            className="stc-field-input"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="stc-field-row">
                                        <label className="stc-field-label" htmlFor="confirm_password">
                                            Verificar Password
                                        </label>
                                        <input
                                            id="confirm_password"
                                            className="stc-field-input"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="stc-submit-btn stc-changepw-submit-btn">
                                        Guardar
                                    </button>
                                </form>
                            </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
