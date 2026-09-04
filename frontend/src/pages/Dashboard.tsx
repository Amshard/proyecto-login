import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <section className="dashboard">
            <h1>Welcome, {user?.username}</h1>
            <p>{user?.email}</p>
            <button type="button" onClick={handleLogout}>
                Log out
            </button>
        </section>
    );
}
