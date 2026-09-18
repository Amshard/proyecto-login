import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Login/Login.css';
import '../pages/Catalogos/Catalogos.css';
import StatusBar from './StatusBar';

interface CatalogoLayoutProps {
    tabLabel: string;
    statusLabel: string;
    count: number;
    onClear: () => void;
    onSave: () => void;
    /** Botones extra del encabezado (solo visibles en la pestaña de catálogo). */
    actions?: ReactNode;
    /** Botón que abre la pestaña de reporte. */
    reportButton?: string;
    /** Campos del formulario, mostrados sobre el panel principal. */
    fields?: ReactNode;
    formError?: boolean;
    overlay?: ReactNode;
    children: ReactNode;
}

export default function CatalogoLayout({
    tabLabel,
    statusLabel,
    count,
    onClear,
    onSave,
    actions,
    reportButton,
    fields,
    formError,
    overlay,
    children,
}: CatalogoLayoutProps) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo'>('catalogo');
    const isCatalogo = activeTab === 'catalogo';

    const tabs = [
        { key: 'catalogo', label: tabLabel },
        { key: 'nuevo', label: 'Reporte' },
    ] as const;

    return (
        <div className="stc-login-page">
            <header className="stc-header">
                {isCatalogo && (
                    <>
                        <button type="button" className="stc-exit-btn stc-clear-btn" onClick={onClear}>
                            Limpiar
                        </button>
                        <button type="button" className="stc-exit-btn stc-save-btn" onClick={onSave}>
                            Guardar
                        </button>
                        {actions}
                        {reportButton && (
                            <button
                                type="button"
                                className="stc-exit-btn stc-report-ops-btn"
                                onClick={() => setActiveTab('nuevo')}
                            >
                                {reportButton}
                            </button>
                        )}
                    </>
                )}
                <button
                    type="button"
                    className="stc-exit-btn stc-salir-btn"
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

            <div className="stc-body stc-catalogo-body">
                <main className="stc-content">
                    <div className="stc-registros-wrapper">
                        {isCatalogo && (
                            <div className="stc-registros-row">
                                <span className="stc-registros-label">Registros</span>
                                <div className="stc-registros-box">{count}</div>
                            </div>
                        )}

                        <div className="stc-content-square stc-changepw-box">
                            <div className="stc-tabs">
                                {tabs.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`stc-tab-btn${activeTab === key ? ' stc-tab-btn-active' : ''}`}
                                        onClick={() => setActiveTab(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {isCatalogo && fields}

                            {isCatalogo && formError && (
                                <div className="stc-form-error">
                                    Por favor llene todos los campos antes de guardar.
                                </div>
                            )}

                            <div className="stc-changepw-body stc-tab-panel">
                                {isCatalogo ? (
                                    children
                                ) : (
                                    <iframe className="stc-report-viewer" src="/blank.pdf" title="Reporte" />
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <StatusBar label={statusLabel} />
            {overlay}
        </div>
    );
}
