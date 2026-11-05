import { useState, type ReactNode } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { RadioOptions, SideButtons } from '../Procesos/ProcesoControls';
import '../Procesos/Procesos.css';
import './Reportes.css';

interface ReportePageProps {
    tabLabel: string;
    statusLabel: string;
    titulo: string;
    subtitulo?: string;
    opciones?: string[];
    bloqueadas?: string[];
    count?: number;
    anio?: boolean;
    onClear?: () => void;
    botones?: { label: string; onClick?: () => void }[];
    arriba?: ReactNode;
    children?: ReactNode;
    opcion?: string;
    onOpcion?: (opcion: string) => void;
}

export default function ReportePage({
    tabLabel,
    statusLabel,
    titulo,
    subtitulo,
    opciones,
    bloqueadas,
    count = 0,
    anio,
    onClear,
    botones = [],
    arriba,
    children,
    opcion: opcionDada,
    onOpcion,
}: ReportePageProps) {
    const [opcionPropia, setOpcionPropia] = useState('');
    const opcion = opcionDada ?? opcionPropia;
    const setOpcion = onOpcion ?? setOpcionPropia;

    return (
        <CatalogoLayout
            tabLabel={tabLabel}
            hideTabs
            pageClassName="stc-sin-bordes"
            statusLabel={statusLabel}
            count={count}
            anio={anio ? new Date().getFullYear() : undefined}
            onClear={onClear}
            actions={<SideButtons buttons={[...botones, { label: 'Ver Reporte' }]} />}
        >
            <fieldset className="stc-reporte-outline">
                <legend className="stc-report-options-title">{titulo}</legend>
                <div className="stc-reporte-columna">
                    {arriba}
                    {opciones && opciones.length > 0 && (
                        <fieldset className="stc-report-options stc-reporte-set">
                            {subtitulo && <legend className="stc-report-options-title">{subtitulo}</legend>}
                            <RadioOptions options={opciones} value={opcion} onChange={setOpcion} disabled={bloqueadas} />
                        </fieldset>
                    )}
                    {children}
                </div>
            </fieldset>
        </CatalogoLayout>
    );
}
