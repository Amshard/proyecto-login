import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { navbarTopButtons, sideButtons } from './keyboardNav';
import Navbar from './Navbar';
import PageHeader from './PageHeader';
import StatusBar from './StatusBar';
import { openPdf, preloadPdf } from '../utils/openPdf';
import type { PdfReport } from '../utils/pdf';

interface CatalogoLayoutProps<R> {
    tabLabel: string;
    statusLabel?: string;
    count?: number;
    onClear?: () => void;
    onSave?: () => void;
    onModify?: () => void;
    onDelete?: () => void;
    editing?: boolean;
    actions?: ReactNode;
    headerText?: ReactNode;
    actionsOnAllTabs?: boolean;
    countOnAllTabs?: boolean;
    anio?: boolean;
    contadores?: { label: string; value: ReactNode }[];
    reportButton?: string;
    onReportButton?: () => void;
    reportActions?: ReactNode;
    reportLabel?: string;
    reportTitle?: string;
    fields?: ReactNode;
    overlay?: ReactNode;
    children: ReactNode;
    pdf?: PdfReport<R>;
    extraTabs?: { label: string; content: ReactNode; actions?: ReactNode }[];
    onTabChange?: () => void;
    hideTabs?: boolean;
    pageClassName?: string;
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
    statusLabel = tabLabel,
    count,
    onClear,
    onSave,
    onModify,
    onDelete,
    editing,
    actions,
    headerText,
    actionsOnAllTabs,
    countOnAllTabs,
    anio,
    contadores = [],
    reportButton,
    onReportButton,
    reportActions,
    reportLabel = 'Generar reporte',
    reportTitle = statusLabel,
    fields,
    overlay,
    children,
    pdf,
    extraTabs = [],
    onTabChange,
    hideTabs,
    pageClassName,
}: CatalogoLayoutProps<R>) {
    const [activeTab, setActiveTab] = useState<'catalogo' | 'nuevo' | number>('catalogo');
    const isCatalogo = activeTab === 'catalogo';
    const isReporte = activeTab === 'nuevo';

    useEffect(() => {
        if (isReporte) preloadPdf();
    }, [isReporte]);

    const tabs: { key: typeof activeTab; label: string }[] = [
        { key: 'catalogo', label: tabLabel },
        ...(extraTabs.length > 0
            ? extraTabs.map(({ label }, i) => ({ key: i, label }))
            : pdf
              ? [{ key: 'nuevo' as const, label: 'Reporte' }]
              : []),
    ];

    return (
        <div className={`stc-login-page${hideTabs ? ' stc-sin-pestanas' : ''}${pageClassName ? ` ${pageClassName}` : ''}`}>
            <Navbar />

            <PageHeader onKeyDown={onSideKeyDown}>
                <div className="stc-side-buttons">
                    {isCatalogo && (
                        <>
                            {onClear && (
                                <button type="button" className="stc-btn stc-exit-btn" onClick={onClear}>
                                    Limpiar
                                </button>
                            )}
                            {editing ? (
                                <>
                                    {onModify && (
                                        <button type="button" className="stc-btn stc-exit-btn" onClick={onModify}>
                                            Modificar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button type="button" className="stc-btn stc-exit-btn" onClick={onDelete}>
                                            Eliminar
                                        </button>
                                    )}
                                </>
                            ) : (
                                onSave && (
                                    <button type="button" className="stc-btn stc-exit-btn" onClick={onSave}>
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
                        </>
                    )}
                    {!isCatalogo && actionsOnAllTabs && actions}
                    {typeof activeTab === 'number' && extraTabs[activeTab]?.actions}
                </div>
                {headerText}
                {count !== undefined && (isCatalogo || countOnAllTabs) && (
                    <div className="stc-header-registros stc-header-contadores">
                        {contadores.map(({ label, value }) => (
                            <div key={label} className="stc-registros-row">
                                <span className="stc-registros-label">{label}</span>
                                <div className="stc-registros-box">{value}</div>
                            </div>
                        ))}
                        {anio && (
                            <div className="stc-registros-row">
                                <span className="stc-registros-label">Año</span>
                                <div className="stc-registros-box">{new Date().getFullYear()}</div>
                            </div>
                        )}
                        <div className="stc-registros-row">
                            <span className="stc-registros-label">Registros</span>
                            <div className="stc-registros-box">{count}</div>
                        </div>
                    </div>
                )}
            </PageHeader>

            <div className="stc-body stc-catalogo-body">
                <main className="stc-content">
                    <div className="stc-registros-wrapper">
                        <div className="stc-content-square stc-changepw-box">
                            {!hideTabs && (
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
                            )}

                            {isCatalogo && fields}

                            <div className="stc-changepw-body stc-tab-panel">
                                {isCatalogo ? (
                                    children
                                ) : typeof activeTab === 'number' ? (
                                    extraTabs[activeTab]?.content
                                ) : pdf ? (
                                    <div className="stc-report-panel">
                                        <fieldset className="stc-report-options stc-report-frame">
                                            <legend className="stc-report-options-title">{reportTitle}</legend>
                                            <button
                                                type="button"
                                                className="stc-btn stc-generar-reporte-btn"
                                                onClick={() => openPdf(pdf)}
                                            >
                                                {reportLabel}
                                            </button>
                                            {reportActions}
                                        </fieldset>
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
