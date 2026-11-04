import { useState, type ReactNode } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { RadioOptions, SideButtons } from '../Procesos/ProcesoControls';
import '../Procesos/Procesos.css';
import './Reportes.css';

interface ReportePageProps {
    tabLabel: string;
    statusLabel: string;
    // Title of the big gray square around the page.
    titulo: string;
    // Title of the square that holds the radio buttons; none when empty.
    subtitulo?: string;
    opciones: string[];
    // Radio buttons shown but locked.
    bloqueadas?: string[];
    count?: number;
    // Adds an "Año" box with the current year, left of Registros.
    anio?: boolean;
    // Shown below the radio buttons square.
    children?: ReactNode;
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
    children,
}: ReportePageProps) {
    const [opcion, setOpcion] = useState('');

    return (
        <CatalogoLayout
            tabLabel={tabLabel}
            hideTabs
            pageClassName="stc-sin-bordes"
            statusLabel={statusLabel}
            count={count}
            anio={anio ? new Date().getFullYear() : undefined}
            actions={<SideButtons buttons={[{ label: 'Ver Reporte' }]} />}
        >
            <fieldset className="stc-reporte-outline">
                <legend className="stc-report-options-title">{titulo}</legend>
                <div className="stc-reporte-columna">
                    <fieldset className="stc-report-options stc-reporte-set">
                        {subtitulo && <legend className="stc-report-options-title">{subtitulo}</legend>}
                        <RadioOptions options={opciones} value={opcion} onChange={setOpcion} disabled={bloqueadas} />
                    </fieldset>
                    {children}
                </div>
            </fieldset>
        </CatalogoLayout>
    );
}
