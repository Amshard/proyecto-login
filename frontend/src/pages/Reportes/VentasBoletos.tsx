import { useState } from 'react';
import Calendario from '../../components/Calendario';
import { RadioOptions } from '../Procesos/ProcesoControls';
import ReportePage from './ReportePage';

const LINEAS = ['Línea 1', 'Línea 2', 'Línea 3', 'Línea 4', 'Línea 5', 'Línea 6', 'Línea 7', 'Línea 8', 'Línea 9', 'Línea 12', 'Línea A', 'Línea B'];

const COLUMNAS = [LINEAS.slice(0, 6), LINEAS.slice(6)];

const REPORTES = [
    'Reporte de Ventas a Detalle',
    'Reporte de Ventas X Linea/Turno',
    'Reporte de Ventas X Linea Concentrado',
    'Ventas de Boletos X Linea/Turno',
    'Ventas de Recargas X Linea/Turno',
    'Ventas de Tarjetas X Linea/Turno'
];

export default function VentasBoletos() {
    const [inicial, setInicial] = useState('');
    const [final, setFinal] = useState('');
    const [marcadas, setMarcadas] = useState<string[]>([]);
    const [reporte, setReporte] = useState('');

    const elegirInicial = (fecha: string) => {
        setInicial(fecha);
        if (final && final < fecha) setFinal('');
    };

    const marcar = (opcion: string) =>
        setMarcadas((prev) => (prev.includes(opcion) ? prev.filter((o) => o !== opcion) : [...prev, opcion]));

    const limpiar = () => {
        setInicial('');
        setFinal('');
        setMarcadas([]);
        setReporte('');
    };

    return (
        <ReportePage
            tabLabel="VENTAS BOLETOS, RECARGAS Y TARJETAS"
            statusLabel="Reporte de Ventas de Boletos, Recargas y Tarjetas"
            titulo="Reporte Acumulados Mensuales"
            onClear={limpiar}
            botones={[{ label: 'Sel. Lineas', onClick: () => setMarcadas(LINEAS) }]}
        >
            <div className="stc-reporte-calendarios">
                <Calendario titulo="Fecha Inicial" value={inicial} onChange={elegirInicial} />
                <Calendario titulo="Fecha Final" value={final} onChange={setFinal} min={inicial} />
                <fieldset className="stc-reporte-checks">
                    <legend className="stc-report-options-title">Seleccione las líneas para inconsistencias</legend>
                    {COLUMNAS.map((columna) => (
                        <div key={columna[0]} className="stc-reporte-check-columna">
                            {columna.map((opcion) => (
                                <label key={opcion} className="stc-report-option">
                                    <input type="checkbox" checked={marcadas.includes(opcion)} onChange={() => marcar(opcion)} />
                                    {opcion}
                                </label>
                            ))}
                        </div>
                    ))}
                </fieldset>
                <fieldset className="stc-reporte-checks stc-reporte-radios">
                    <legend className="stc-report-options-title">Tipo de Reporte</legend>
                    <RadioOptions options={REPORTES} value={reporte} onChange={setReporte} />
                </fieldset>
            </div>
        </ReportePage>
    );
}
