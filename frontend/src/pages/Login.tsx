import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
                ? (err.response?.data?.detail ?? 'Invalid email or password')
                : 'Something went wrong';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-form">
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="form-error">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Log in'}
                </button>
            </form>
            <p>
                No account? <Link to="/register">Register</Link>
            </p>
        </section>
    );
}
