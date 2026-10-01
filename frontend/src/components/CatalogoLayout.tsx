import { useState, type KeyboardEvent, type ReactNode } from 'react';
import '../pages/Login/Login.css';
import '../pages/Catalogos/Catalogos.css';
import { navbarTopButtons, sideButtons } from './keyboardNav';
import Navbar from './Navbar';
import PageHeader from './PageHeader';
import StatusBar from './StatusBar';
import { openPdf, type PdfReport } from '../utils/pdf';

interface CatalogoLayoutProps<R> {
    tabLabel: string;
    statusLabel: string;
    count: number;
    onClear: () => void;
    onSave: () => void;
    onModify?: () => void;
    onDelete: () => void;
    editing: boolean;
    actions?: ReactNode;
    reportButton?: string;
    // Extra buttons shown in the Reporte tab, above Generar reporte.
    reportActions?: ReactNode;
    // Text of the button that generates the catalog's PDF.
    reportLabel?: string;
    fields?: ReactNode;
    overlay?: ReactNode;
    children: ReactNode;
    pdf: PdfReport<R>;
}

// Up/Down move through the left button column; Up from the top one goes back to the navbar
// and Right jumps to the navbar too. Enter presses the button as usual.
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
    reportActions,
    reportLabel = 'Generar reporte',
    fields,
    overlay,
    children,
    pdf,
}: CatalogoLayoutProps<R>) {
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo'>('catalogo');
    const isCatalogo = activeTab === 'catalogo';

    const tabs = [
        { key: 'catalogo', label: tabLabel },
        { key: 'nuevo', label: 'Reporte' },
    ] as const;

    return (
        <div className="stc-login-page">
            <Navbar />

            <PageHeader onKeyDown={onSideKeyDown}>
                {isCatalogo && (
                    <>
                        <button type="button" className="stc-btn stc-exit-btn stc-clear-btn" onClick={onClear}>
                            Limpiar
                        </button>
                        {editing ? (
                            <>
                                {onModify && (
                                    <button type="button" className="stc-btn stc-exit-btn stc-save-btn" onClick={onModify}>
                                        Modificar
                                    </button>
                                )}
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
                {isCatalogo && (
                    <div className="stc-registros-row stc-header-registros">
                        <span className="stc-registros-label">Registros</span>
                        <div className="stc-registros-box">{count}</div>
                    </div>
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
                                        {reportActions}
                                        <button
                                            type="button"
                                            className="stc-btn stc-generar-reporte-btn"
                                            onClick={() => openPdf(pdf)}
                                        >
                                            {reportLabel}
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
