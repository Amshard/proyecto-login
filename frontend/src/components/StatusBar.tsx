import { useAuth } from '../context/AuthContext';

const longDate = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});

// The backend sends midnight UTC; formatting in UTC keeps the calendar day in Mexico City's time zone.
const formatLongDate = (value: string | undefined) => (value ? longDate.format(new Date(value)) : '');

interface StatusBarProps {
    label: string;
}

export default function StatusBar({ label }: StatusBarProps) {
    const { user } = useAuth();
    const today = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return (
        <footer className="stc-status-bar">
            <div className="stc-status-row">
                <span className="stc-status-square">{user?.rol_vigente?.nombre_rol}</span>
                <span className="stc-status-square">Vigencia: </span>
                <span className="stc-status-square">{formatLongDate(user?.rol_vigente?.fecha_ini)}</span>
                <span className="stc-status-square">{formatLongDate(user?.rol_vigente?.fecha_fin)}</span>
                <span className="stc-status-square">{user?.rol_vigente?.meses_q_califica}</span>
            </div>
            <div className="stc-status-row stc-status-row-lower">
                <span className="stc-status-square">Usuario: {user?.nombre}</span>
                <span className="stc-status-square">{label}</span>
                <span className="stc-status-square">{today}</span>
            </div>
        </footer>
    );
}
