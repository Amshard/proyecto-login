import { useLocation, useParams } from 'react-router-dom';
import './Login/Login.css';
import Navbar from '../components/Navbar';
import StatusBar from '../components/StatusBar';

function unslugify(slug: string): string {
    return slug
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function SectionPage() {
    const location = useLocation();
    const { item } = useParams<{ item: string }>();

    const title = (location.state as { title?: string } | null)?.title ?? unslugify(item ?? '');

    return (
        <div className="stc-login-page">
            <Navbar />

            <header className="stc-header">
                <div className="stc-header-accent" />
                <div className="stc-header-text">
                    COORDINACIÓN DE TAQUILLA
                    <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-content-square stc-changepw-box">
                        <div className="stc-changepw-titlebar">{title}</div>
                        <div className="stc-changepw-body" />
                    </div>
                </main>
            </div>

            <StatusBar label={title} />
        </div>
    );
}
