import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Login/Login.css';
import StatusBar from '../components/StatusBar';

function unslugify(slug: string): string {
    return slug
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

interface SectionPageState {
    title?: string;
    section?: string;
    group?: string;
}

export default function SectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{ section: string; group?: string; item: string }>();
    const state = (location.state ?? {}) as SectionPageState;

    const title = state.title ?? unslugify(params.item ?? '');

    return (
        <div className="stc-login-page">

            <header className="stc-header">
                <button
                    type="button"
                    className="stc-exit-btn"
                    onClick={() => navigate('/dashboard')}
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
                        <div className="stc-changepw-titlebar">
                            {title}
                        </div>

                        <div className="stc-changepw-body">
                        </div>
                    </div>
                </main>
            </div>

            <StatusBar label={`${title}`} />
        </div>
    );
}
