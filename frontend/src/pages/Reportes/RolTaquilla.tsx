import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { RadioOptions } from '../Procesos/ProcesoControls';
import '../Procesos/Procesos.css';

const OPCIONES = [
    'Prepara Informacion para los reportes',
    'Genera con Calificación',
    'General Sin Calificacion',
    'Alfabético',
    'Lugares no asignados en el Rol',
    'Rol de Taquilla con Calificación'
];

export default function RolTaquilla() {
    const [opcion, setOpcion] = useState('');

    return (
        <CatalogoLayout tabLabel="ROL TAQUILLA" hideTabs statusLabel="Reporte del Rol de Taquilla">
            <fieldset className="stc-report-options stc-asignacion-set stc-reporte-centrado">
                <legend className="stc-report-options-title">Rol de Taquilla</legend>
                <RadioOptions options={OPCIONES} value={opcion} onChange={setOpcion} />
            </fieldset>
        </CatalogoLayout>
    );
}
