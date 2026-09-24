import { useEffect, useState, type ReactNode } from 'react';
import '../pages/Login/Login.css';
import '../pages/Catalogos/Catalogos.css';
import Navbar from './Navbar';
import StatusBar from './StatusBar';
import type { Column } from './DataTable';
import { buildCatalogoPdfBlob } from '../utils/pdf';

interface CatalogoLayoutProps<R> {
    tabLabel: string;
    statusLabel: string;
    count: number;
    onClear: () => void;
    onSave: () => void;
    onModify?: () => void;
    onDelete?: () => void;
    // A table row is loaded: Modificar/Eliminar replace Guardar.
    editing?: boolean;
    actions?: ReactNode;
    reportButton?: string;
    fields?: ReactNode;
    overlay?: ReactNode;
    children: ReactNode;
    pdfTitle?: string;
    pdfColumns?: Column<R>[];
    pdfRows?: R[];
    pdfCountLabel?: string;
    pdfCountTitle?: string;
}

export default function CatalogoLayout<R>({
    tabLabel,
    statusLabel,
    count,
    onClear,
    onSave,
    onModify,
    onDelete,
    editing = false,
    actions,
    reportButton,
    fields,
    overlay,
    children,
    pdfTitle,
    pdfColumns,
    pdfRows,
    pdfCountLabel,
    pdfCountTitle,
}: CatalogoLayoutProps<R>) {
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo'>('catalogo');
    const isCatalogo = activeTab === 'catalogo';
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isCatalogo || !pdfColumns || !pdfRows) return;
        const blob = buildCatalogoPdfBlob(
            pdfTitle ?? reportButton ?? statusLabel,
            pdfColumns,
            pdfRows,
            pdfCountLabel,
            pdfCountTitle
        );
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [isCatalogo, pdfColumns, pdfRows, pdfTitle, reportButton, statusLabel, pdfCountLabel, pdfCountTitle]);

    const tabs = [
        { key: 'catalogo', label: tabLabel },
        { key: 'nuevo', label: 'Reporte' },
    ] as const;

    return (
        <div className="stc-login-page">
            <Navbar />

            <header className="stc-header">
                {isCatalogo && (
                    <>
                        <button type="button" className="stc-btn stc-exit-btn stc-clear-btn" onClick={onClear}>
                            Limpiar
                        </button>
                        {editing ? (
                            <>
                                <button type="button" className="stc-btn stc-exit-btn stc-save-btn" onClick={onModify}>
                                    Modificar
                                </button>
                                <button type="button" className="stc-btn stc-exit-btn stc-delete-btn" onClick={onDelete}>
                                    Eliminar
                                </button>
                            </>
                        ) : (
                            <button type="button" className="stc-btn stc-exit-btn stc-save-btn" onClick={onSave}>
                                Guardar
                            </button>
                        )}
                        {actions}
                        {reportButton && (
                            <button
                                type="button"
                                className="stc-btn stc-exit-btn stc-report-ops-btn"
                                onClick={() => setActiveTab('nuevo')}
                            >
                                {reportButton}
                            </button>
                        )}
                    </>
                )}
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

                            <div className="stc-changepw-body stc-tab-panel">
                                {isCatalogo ? (
                                    children
                                ) : (
                                    <div className="stc-report-panel">
                                        <button
                                            type="button"
                                            className="stc-btn stc-generar-reporte-btn"
                                            disabled={!pdfUrl}
                                            onClick={() => {
                                                if (pdfUrl) window.open(pdfUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                        >
                                            Generar reporte
                                        </button>
                                    </div>
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
