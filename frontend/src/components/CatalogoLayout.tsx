import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import '../pages/Login/Login.css';
import '../pages/Catalogos/Catalogos.css';
import { navbarTopButtons, sideButtons } from './keyboardNav';
import Navbar from './Navbar';
import StatusBar from './StatusBar';
import type { Column } from './DataTable';
import { buildCatalogoPdfBlob, type PdfGroup } from '../utils/pdf';

interface CatalogoLayoutProps<R> {
    tabLabel: string;
    statusLabel: string;
    count: number;
    onClear: () => void;
    onSave: () => void;
    onModify?: () => void;
    onDelete?: () => void;
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
    pdfNoteLabel?: string;
    pdfNoteById?: boolean;
    pdfCountBold?: boolean;
    pdfCountUnderline?: boolean;
    pdfCountUnderlineSplit?: boolean;
    pdfTitleBold?: boolean;
    pdfRowPadding?: number;
    pdfGroup?: PdfGroup<R>;
    pdfUnofficialNotes?: boolean;
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
    pdfNoteLabel,
    pdfNoteById,
    pdfCountBold,
    pdfCountUnderline,
    pdfCountUnderlineSplit,
    pdfTitleBold,
    pdfRowPadding,
    pdfGroup,
    pdfUnofficialNotes,
}: CatalogoLayoutProps<R>) {
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo'>('catalogo');
    const isCatalogo = activeTab === 'catalogo';
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isCatalogo || !pdfColumns || !pdfRows) return;
        const blob = buildCatalogoPdfBlob(pdfTitle ?? reportButton ?? statusLabel, pdfColumns, pdfRows, {
            countLabel: pdfCountLabel,
            countTitle: pdfCountTitle,
            noteLabel: pdfNoteLabel,
            noteById: pdfNoteById,
            countBold: pdfCountBold,
            countUnderline: pdfCountUnderline,
            countUnderlineSplit: pdfCountUnderlineSplit,
            titleBold: pdfTitleBold,
            rowPadding: pdfRowPadding,
            group: pdfGroup,
            unofficialNotes: pdfUnofficialNotes,
        });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [isCatalogo, pdfColumns, pdfRows, pdfTitle, reportButton, statusLabel, pdfCountLabel, pdfCountTitle, pdfNoteLabel, pdfNoteById, pdfCountBold, pdfCountUnderline, pdfCountUnderlineSplit, pdfTitleBold, pdfRowPadding, pdfGroup, pdfUnofficialNotes]);

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

    const tabs = [
        { key: 'catalogo', label: tabLabel },
        { key: 'nuevo', label: 'Reporte' },
    ] as const;

    return (
        <div className="stc-login-page">
            <Navbar />

            <header className="stc-header" onKeyDown={onSideKeyDown}>
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
