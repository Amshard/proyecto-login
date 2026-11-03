import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { RadioOptions, SideButtons } from '../Procesos/ProcesoControls';
import '../Procesos/Procesos.css';

const OPCIONES = ['General', 'Por Permanencia'];

export default function Calificaciones() {
    const [opcion, setOpcion] = useState('');

    return (
        <CatalogoLayout
            tabLabel="CALIFICACIONES"
            hideTabs
            pageClassName="stc-sin-bordes"
            statusLabel="Reporte de Calificaciones"
            actions={<SideButtons buttons={[{ label: 'Ver Reporte' }]} />}
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide">
                <legend className="stc-report-options-title">Emisión de Calificaciones</legend>
                <fieldset className="stc-report-options stc-asignacion-set stc-reporte-centrado stc-reporte-izquierda stc-reporte-grande">
                    <legend className="stc-report-options-title">Personal de Taquilla</legend>
                    <RadioOptions options={OPCIONES} value={opcion} onChange={setOpcion} />
                </fieldset>
            </fieldset>
        </CatalogoLayout>
    );
}
