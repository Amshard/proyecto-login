import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [idUsuario, setIdUsuario] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register({ id_usuario: idUsuario, nombre, password });
            navigate('/dashboard');
        } catch (err) {
            let message = 'Something went wrong';
            if (axios.isAxiosError(err) && err.response?.data) {
                const data = err.response.data as Record<string, string[]>;
                message = Object.values(data).flat().join(' ') || message;
            }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-form">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="id_usuario">Cuenta de acceso</label>
                <input
                    id="id_usuario"
                    type="text"
                    maxLength={5}
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                    required
                />

                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    maxLength={60}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    minLength={8}
                    maxLength={16}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="form-error">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </section>
    );
}
