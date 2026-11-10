import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualField } from '../../components/ManualField';
import { SideButtons } from '../Procesos/ProcesoControls';
import { NO_ROWS, campoIzq, headersOnly, numero } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import './Vacaciones.css';

const ANIO_FIELD = campoIzq(numero('anio', 'Proporcione el Año', 4, 60));

const COLUMNAS = headersOnly(['Año', 'Rol', 'Inc Cargadas', 'Fech_ini', 'Fech_FIn', 'Fec_Respaldo', 'Registros']);

export default function PromediaCalificaciones() {
    const [anio, setAnio] = useState('');

    return (
        <CatalogoLayout
            tabLabel="PROMEDIA CALIFICACIONES"
            hideTabs
            statusLabel="Promedio de Calificaciones"
            actions={
                <SideButtons
                    buttons={[
                        { label: 'Limpia', onClick: () => setAnio('') },
                        { label: 'Busca' },
                        { label: 'Promedia' },
                        { label: 'Ver Reporte' },
                    ]}
                />
            }
            pageClassName="stc-sin-bordes"
        >
            <fieldset className="stc-reporte-outline stc-promedia-outline">
                <legend className="stc-report-options-title">Promedia Calificaciones para Vacaciones</legend>
                <div className="stc-promedia-campos">
                    <ManualField config={ANIO_FIELD} value={anio} onChange={setAnio} />
                </div>
                <DataTable
                    title="Roles Respaldados en el Historico"
                    className="stc-promedia-tabla"
                    rowHeader={2}
                    columns={COLUMNAS}
                    rows={NO_ROWS}
                />
            </fieldset>
        </CatalogoLayout>
    );
}
