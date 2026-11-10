import { Fragment, useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField } from '../../components/ManualField';
import { SideButtons } from '../Procesos/ProcesoControls';
import { NO_ROWS, campoIzq, headersOnly, numero, replaceIn } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import './Vacaciones.css';

const EXPEDIENTE_FIELD = campoIzq(numero('expediente', 'Expediente', 5, 70));

const OPCIONES = ['1Era Opc', '2da Opc', '3Era Opc'];
const PERIODOS = ['1er PERIODO', '2do PERIODO'];
const OPCIONES_VACIAS = PERIODOS.map(() => OPCIONES.map(() => ''));

const COLUMNAS: Column<never>[] = [
    ...headersOnly(['Expediente', 'Nombre']),
    ...PERIODOS.flatMap((periodo) =>
        headersOnly(OPCIONES).map((col, i) => (i === 1 ? { ...col, above: periodo } : col))
    ),
];

export default function CapturaSolicitudes() {
    const [expediente, setExpediente] = useState('');
    const [nombre, setNombre] = useState('');
    const [opciones, setOpciones] = useState(OPCIONES_VACIAS);

    const limpiar = () => {
        setExpediente('');
        setNombre('');
        setOpciones(OPCIONES_VACIAS);
    };

    return (
        <CatalogoLayout
            tabLabel="Captura Solicitudes de Vacaciones"
            statusLabel="Solicitudes de Vacaciones"
            count={0}
            actions={
                <SideButtons
                    buttons={[
                        { label: 'Guardar' },
                        { label: 'Limpiar', onClick: limpiar },
                        { label: 'Buscar' },
                        { label: 'Ver Reporte' },
                    ]}
                />
            }
            contadores={[
                { label: 'Periodos registrados', value: '' },
                { label: 'Del Año', value: new Date().getFullYear() },
            ]}
        >
            <div className="stc-captura-columna">
                <fieldset className="stc-reporte-outline stc-captura-outline">
                    <legend className="stc-report-options-title">Captura Solicitudes de Vacaciones</legend>
                    <div className="stc-solicitud-fila">
                        <ManualField config={EXPEDIENTE_FIELD} value={expediente} onChange={setExpediente} />
                        <input
                            className="stc-field-input stc-solicitud-nombre"
                            aria-label="Nombre"
                            maxLength={50}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div className="stc-solicitud-opciones">
                        <span />
                        {OPCIONES.map((opcion) => (
                            <span key={opcion} className="stc-field-label stc-solicitud-opcion">
                                {opcion}
                            </span>
                        ))}
                        {PERIODOS.map((periodo, fila) => (
                            <Fragment key={periodo}>
                                <span className="stc-field-label stc-solicitud-periodo">{periodo}</span>
                                {OPCIONES.map((opcion, col) => (
                                    <input
                                        key={opcion}
                                        className="stc-field-input"
                                        aria-label={`${periodo}, ${opcion}`}
                                        value={opciones[fila][col]}
                                        onChange={(e) =>
                                            setOpciones((prev) => replaceIn(prev, fila, col, e.target.value))
                                        }
                                    />
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </fieldset>
                <DataTable title="Solicitudes" className="stc-table-fit stc-captura-tabla" columns={COLUMNAS} rows={NO_ROWS} />
            </div>
        </CatalogoLayout>
    );
}
