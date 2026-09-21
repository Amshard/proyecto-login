import { Fragment, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { changePassword } from '../../api/auth';
import PageHeader from '../../components/PageHeader';

const FIELDS = [
    { name: 'current_password', label: 'Password actual' },
    { name: 'new_password', label: 'Nuevo Password' },
    { name: 'confirm_password', label: 'Verificar Password' },
] as const;

type Values = Record<(typeof FIELDS)[number]['name'], string>;

export default function ChangePassword() {
    const navigate = useNavigate();
    const [values, setValues] = useState<Values>({ current_password: '', new_password: '', confirm_password: '' });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        changePassword(values)
            .then(() => navigate('/dashboard'))
            .catch((err) => {
                const data = axios.isAxiosError(err) ? err.response?.data : undefined;
                setError(
                    axios.isAxiosError(err)
                        ? (data?.current_password?.[0]
                            ?? data?.new_password?.[0]
                            ?? data?.non_field_errors?.[0]
                            ?? data?.detail
                            ?? 'No se pudo cambiar la contraseña')
                        : 'Ocurrió un error, intenta de nuevo'
                );
            });
    };

    return (
        <div className="stc-login-page">
            <PageHeader onExit={() => navigate('/login', { replace: true })} />

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-content-square stc-changepw-box">
                        <div className="stc-changepw-titlebar">Cambio de Password</div>

                        <div className="stc-changepw-body">
                            <form onSubmit={handleSubmit}>
                                {FIELDS.map(({ name, label }, i) => (
                                    <Fragment key={name}>
                                        <div className="stc-field-row">
                                            <label className="stc-field-label" htmlFor={name}>
                                                {label}
                                            </label>
                                            <input
                                                id={name}
                                                className="stc-field-input"
                                                type="password"
                                                value={values[name]}
                                                onChange={(e) => setValues({ ...values, [name]: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {i === 0 && error && <p className="stc-error">{error}</p>}
                                    </Fragment>
                                ))}

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
