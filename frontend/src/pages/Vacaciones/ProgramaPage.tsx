import { useState, type ReactNode } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import ProcesoOption from '../Procesos/ProcesoOption';
import ProgressBar from '../Procesos/ProgressBar';
import ProgramaCampos from './ProgramaCampos';
import '../Procesos/Procesos.css';
import '../Reportes/Reportes.css';
import './Vacaciones.css';

interface ProgramaPageProps {
    tabLabel: string;
    statusLabel: string;
    opcion: string;
    titulo?: string;
    count?: number;
    prejubilados?: boolean;
    sinCampos?: boolean;
    actions?: ReactNode;
    anio?: boolean;
}

type ProgramaContenidoProps = Pick<ProgramaPageProps, 'opcion' | 'titulo' | 'prejubilados' | 'sinCampos'>;

export function ProgramaContenido({ opcion, titulo, prejubilados, sinCampos }: ProgramaContenidoProps) {
    const [checked, setChecked] = useState(false);

    return (
        <fieldset className="stc-reporte-outline stc-vacaciones-outline">
            {titulo && <legend className="stc-report-options-title">{titulo}</legend>}
            {!sinCampos && <ProgramaCampos prejubilados={prejubilados} />}
            <ProcesoOption label={opcion} checked={checked} onCheck={() => setChecked(true)} />
            <ProgressBar value={0} />
        </fieldset>
    );
}

export default function ProgramaPage({ tabLabel, statusLabel, count, actions, anio, ...contenido }: ProgramaPageProps) {
    return (
        <CatalogoLayout tabLabel={tabLabel} hideTabs count={count} statusLabel={statusLabel} pageClassName="stc-sin-bordes" actions={actions} anio={anio}>
            <ProgramaContenido {...contenido} />
        </CatalogoLayout>
    );
}
