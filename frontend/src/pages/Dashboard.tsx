import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login/Login.css';

function slugify(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const NAV_ITEMS = [
    {
        label: 'Catálogos',
        items: [
            'Permanencias',
            'Lineas',
            'Estaciones',
            'Taquillas',
            'Descansos',
            'Personal de Taquilla',
            'Personal Provisional',
        ],
    },
    {
        label: 'Procesos',
        items: [
            'Respalda Rol Vigente',
            'Rol de Descansos',
            { label: 'Para Calificación', items: ['Prepara Expedientes (Para Asignar Incidencias)', 'Carga Incidencias desde Archivos (Excel)', 'Asignación de Indicencias', 'Roles por Turno y Línea (Promedia Calificación)', 'Califica', 'Actualiza Incidencias (X Expediente)', 'Actualiza Calificacion ( X Rango ) Por cambio de Linea-y Turno'] },
            'Cambio de Posiciones en el Rol',
            'Agrega un luga en el Rol',
            'Excel - Concentrado de Lineas-Turnos x Exp',
        ],
    },
    { label: 'Reportes', items: ['Calificaciones', 'Rol Taquilla', 'Categorias en Taquilla', 'Dias Compensados', 'Concentrado para Asistencia', 'Totales del Rol Vigente por Permanencia y Periodos', 'Ventas Boletos, Recargas y Tarjetas'] },
    { label: 'Consultas', items: ['Ubicación por Expediente', 'Calificaciones', 'Periodos Vacacionales por Expediente'] },
    { label: 'Vacaciones', items: ['  Fecha de Captura WEB', 'INICIO ANUAL DE VACACIONES', '  Captura Periodos Vacacionales', 'CAPTURA DE SOLICITUDES', '  Genera Solicitudes Para el Personal Faltante', '  Reporte de Vacaciones Con y Sin Solicitud', 'PROMEDIA CALIFICACIONES', 'GENERA PROG ANUAL DE VACACIONES (Asignacion)', '  Genera Comparativo', '  Reporte Comparativo de Vacaciones Asignadas', ' Reportes del Programa Anual', '  Re-Asigna Periodos Vacacionales por Expediente'] },
    {
        label: 'Utilerías',
        items: [
            'Usuarios',
            { label: 'Parámetros Para Calificación', items: ['Antiguedad STC', 'Asistencia (Faltas)', 'Puntualidad (Retardos)', 'Roles en la Línea y en el Turno', 'Faltante de Efectivo', 'Fecuencia FE', 'Sanciones'] },
            'Cambia de Rol y Captura Roles en el Año',
            'Captura Catorcenas del año',
        ],
    },
    { label: 'A Excel', items: ['Personal de Taquilla', 'Calificaciones', 'Personal_vacaciones', 'Rol vigente para Dias Economicos', 'Respalda Personal de Taquilla', 'Respalda Calificaciones'] },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const today = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="stc-login-page">

            <nav className="stc-navbar">
                {NAV_ITEMS.map((navItem) => (
                    <div
                        key={navItem.label}
                        className="stc-nav-item"
                        onMouseLeave={() => {
                            setOpenMenu(null);
                            setOpenSubMenu(null);
                        }}
                    >
                        <button
                            type="button"
                            className="stc-nav-btn"
                            onClick={() =>
                                setOpenMenu((prev) => (prev === navItem.label ? null : navItem.label))
                            }
                        >
                            {navItem.label}
                        </button>
                        {openMenu === navItem.label && (
                            <ul className="stc-submenu">
                                {navItem.items.map((item, index) => {
                                    const hasSubMenu = typeof item !== 'string';
                                    const label = hasSubMenu ? item.label : item;
                                    const subMenuKey = `${navItem.label}-${index}`;

                                    return (
                                        <li
                                            key={index}
                                            className="stc-submenu-item"
                                            onMouseEnter={
                                                hasSubMenu ? () => setOpenSubMenu(subMenuKey) : undefined
                                            }
                                            onMouseLeave={
                                                hasSubMenu ? () => setOpenSubMenu(null) : undefined
                                            }
                                        >
                                            <button
                                                type="button"
                                                className="stc-submenu-btn"
                                                onClick={() => {
                                                    if (hasSubMenu) return;
                                                    setOpenMenu(null);
                                                    navigate(`/dashboard/${slugify(navItem.label)}/${slugify(label)}`, {
                                                        state: { title: label, section: navItem.label },
                                                    });
                                                }}
                                            >
                                                {label}
                                                {hasSubMenu && <span className="stc-submenu-arrow">›</span>}
                                            </button>
                                            {hasSubMenu && openSubMenu === subMenuKey && (
                                                <ul className="stc-submenu stc-submenu-flyout">
                                                    {item.items.map((subItem, subIndex) => (
                                                        <li key={subIndex}>
                                                            <button
                                                                type="button"
                                                                className="stc-submenu-btn"
                                                                onClick={() => {
                                                                    setOpenSubMenu(null);
                                                                    setOpenMenu(null);
                                                                    navigate(
                                                                        `/dashboard/${slugify(navItem.label)}/${slugify(item.label)}/${slugify(subItem)}`,
                                                                        {
                                                                            state: {
                                                                                title: subItem,
                                                                                section: navItem.label,
                                                                                group: item.label,
                                                                            },
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                {subItem}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
                <button type="button" className="stc-nav-btn" onClick={handleLogout}>Salir</button>
            </nav>

            <header className="stc-header">
                <div className="stc-header-accent" />
                <div className="stc-header-text">
                </div>
            </header>

            <div className="stc-body">
                <main className="stc-content">
                    <div className="stc-content-square" />
                </main>
            </div>

            <footer className="stc-status-bar">
                <span className="stc-status-square">Página: Menú Principal</span>
                <span className="stc-status-square">Usuario: {user?.nombre}</span>
                <span className="stc-status-square">{user?.rol_vigente?.nombre_rol}</span>
                <span className="stc-status-square">Vigencia: </span>
                <span className="stc-status-square">{user?.rol_vigente?.fecha_ini}</span>
                <span className="stc-status-square">{user?.rol_vigente?.fecha_fin}</span>
                <span className="stc-status-square">{user?.rol_vigente?.meses_q_califica}</span>
                <span className="stc-status-square">{today}</span>
            </footer>
        </div>
    );
}
