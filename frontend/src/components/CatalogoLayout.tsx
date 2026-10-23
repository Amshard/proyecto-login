import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import '../pages/Login/Login.css';
import '../pages/Catalogos/Catalogos.css';
import { navbarTopButtons, sideButtons } from './keyboardNav';
import Navbar from './Navbar';
import PageHeader from './PageHeader';
import StatusBar from './StatusBar';
import { openPdf, preloadPdf } from '../utils/openPdf';
import type { PdfReport } from '../utils/pdf';

interface CatalogoLayoutProps<R> {
    tabLabel: string;
    statusLabel: string;
    count?: number;
    onClear?: () => void;
    onSave?: () => void;
    onModify?: () => void;
    onDelete?: () => void;
    editing?: boolean;
    actions?: ReactNode;
    reportButton?: string;
    onReportButton?: () => void;
    reportActions?: ReactNode;
    reportLabel?: string;
    fields?: ReactNode;
    overlay?: ReactNode;
    children: ReactNode;
    pdf?: PdfReport<R>;
    // Replaces the Reporte tab with a tab of the page's own.
    secondTab?: { label: string; content: ReactNode };
    onTabChange?: () => void;
}

const onSideKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const buttons = sideButtons();
    const index = buttons.indexOf(e.target as HTMLButtonElement);
    if (index < 0) return;
    let next: HTMLButtonElement | undefined;
    if (e.key === 'ArrowDown') next = buttons[(index + 1) % buttons.length];
    else if (e.key === 'ArrowUp') next = index === 0 ? navbarTopButtons()[0] : buttons[index - 1];
    else if (e.key === 'ArrowRight') next = navbarTopButtons()[0];
    if (!next) return;
    e.preventDefault();
    next.focus();
};

export default function CatalogoLayout<R>({
    tabLabel,
    statusLabel,
    count,
    onClear,
    onSave,
    onModify,
    onDelete,
    editing,
    actions,
    reportButton,
    onReportButton,
    reportActions,
    reportLabel = 'Generar reporte',
    fields,
    overlay,
    children,
    pdf,
    secondTab,
    onTabChange,
}: CatalogoLayoutProps<R>) {
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo'>('catalogo');
    const isCatalogo = activeTab === 'catalogo';

    useEffect(() => {
        if (!isCatalogo && !secondTab) preloadPdf();
    }, [isCatalogo, secondTab]);

    const tabs = [
        { key: 'catalogo', label: tabLabel },
        ...(secondTab || pdf ? [{ key: 'nuevo', label: secondTab?.label ?? 'Reporte' } as const] : []),
    ] as const;

    return (
        <div className="stc-login-page">
            <Navbar />

            <PageHeader onKeyDown={onSideKeyDown}>
                {isCatalogo && (
                    <>
                        {onClear && (
                            <button type="button" className="stc-btn stc-exit-btn stc-clear-btn" onClick={onClear}>
                                Limpiar
                            </button>
                        )}
                        {editing ? (
                            <>
                                {onModify && (
                                    <button type="button" className="stc-btn stc-exit-btn stc-save-btn" onClick={onModify}>
                                        Modificar
                                    </button>
                                )}
                                {onDelete && (
                                    <button type="button" className="stc-btn stc-exit-btn stc-delete-btn" onClick={onDelete}>
                                        Eliminar
                                    </button>
                                )}
                            </>
                        ) : (
                            onSave && (
                                <button type="button" className="stc-btn stc-exit-btn stc-save-btn" onClick={onSave}>
                                    Guardar
                                </button>
                            )
                        )}
                        {actions}
                        {reportButton && (
                            <button
                                type="button"
                                className="stc-btn stc-exit-btn stc-report-ops-btn"
                                onClick={onReportButton ?? (() => setActiveTab('nuevo'))}
                            >
                                {reportButton}
                            </button>
                        )}
                        {count !== undefined && (
                            <div className="stc-registros-row stc-header-registros">
                                <span className="stc-registros-label">Registros</span>
                                <div className="stc-registros-box">{count}</div>
                            </div>
                        )}
                    </>
                )}
            </PageHeader>

            <div className="stc-body stc-catalogo-body">
                <main className="stc-content">
                    <div className="stc-registros-wrapper">
                        <div className="stc-content-square stc-changepw-box">
                            <div className="stc-tabs">
                                {tabs.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`stc-tab-btn${activeTab === key ? ' stc-tab-btn-active' : ''}`}
                                        onClick={() => {
                                            if (key !== activeTab) onTabChange?.();
                                            setActiveTab(key);
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {isCatalogo && fields}

                            <div className="stc-changepw-body stc-tab-panel">
                                {isCatalogo ? (
                                    children
                                ) : secondTab ? (
                                    secondTab.content
                                ) : pdf ? (
                                    <div className="stc-report-panel">
                                        <button
                                            type="button"
                                            className="stc-btn stc-generar-reporte-btn"
                                            onClick={() => openPdf(pdf)}
                                        >
                                            {reportLabel}
                                        </button>
                                        {reportActions}
                                    </div>
                                ) : null}
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
