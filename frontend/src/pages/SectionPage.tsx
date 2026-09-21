import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Login/Login.css';
import PageHeader from '../components/PageHeader';
import StatusBar from '../components/StatusBar';

function unslugify(slug: string): string {
    return slug
        .split('-')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function SectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { item } = useParams<{ item: string }>();

    const title = (location.state as { title?: string } | null)?.title ?? unslugify(item ?? '');

    return (
        <div className="stc-login-page">
            <PageHeader onExit={() => navigate('/dashboard')} />

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
