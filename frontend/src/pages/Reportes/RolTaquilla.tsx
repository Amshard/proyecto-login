import { useState } from 'react';
import ReportePage from './ReportePage';

const OPCIONES = [
    'Prepara Informacion para los reportes',
    'Genera con Calificación',
    'General Sin Calificacion',
    'Alfabético',
    'Lugares no asignados en el Rol',
    'Rol de Taquilla con Calificación'
];
const BLOQUEADAS = [OPCIONES[OPCIONES.length - 1]];

export default function RolTaquilla() {
    const [preRol, setPreRol] = useState('');

    return (
        <ReportePage
            tabLabel="ROL TAQUILLA"
            statusLabel="Reportes Rol Taquilla"
            titulo="Emisión del Rol"
            subtitulo="Rol de Taquilla"
            opciones={OPCIONES}
            bloqueadas={BLOQUEADAS}
        >
            <label className="stc-pre-rol">
                <span className="stc-field-label">Pre - Rol</span>
                <input className="stc-field-input" value={preRol} onChange={(e) => setPreRol(e.target.value)} />
            </label>
        </ReportePage>
    );
}
