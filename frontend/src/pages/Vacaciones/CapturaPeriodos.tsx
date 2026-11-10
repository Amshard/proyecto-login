import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { dateField } from '../Catalogos/useCatalogo';
import { NO_ROWS, campo, headersOnly, numero, useForm } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import { reporteTab } from './reporteTab';
import './Vacaciones.css';

const ANIO_FIELDS = [campo(numero('anio', 'Año', 4, 60))];

const PERIODO_FIELDS = [numero('numero', 'Numero', 2, 50), dateField('del', 'Del'), dateField('al', 'Al')].map(campo);

const FIELDS = [...ANIO_FIELDS, ...PERIODO_FIELDS];

const COLUMNAS = headersOnly(['Año', 'Periodo', 'Del', 'Al', 'Descripción Periodo']);

export default function CapturaPeriodos() {
    const [form, setField] = useForm(FIELDS);
    const [nota, setNota] = useState('');

    const generarReporte = () => {};
    const guardar = () => {};

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Periodos Vacacionales"
            statusLabel="Catálogo de Periodos Vacacionales"
            count={0}
            countOnAllTabs
            onSave={guardar}
            extraTabs={[reporteTab('Catálogo de Periodos Vacacionales', generarReporte)]}
        >
            <div className="stc-captura-columna">
                <fieldset className="stc-reporte-outline stc-captura-outline">
                    <ManualFields className="stc-captura-fila" fields={ANIO_FIELDS} form={form} onChange={setField} />
                    <ManualFields className="stc-captura-fila" fields={PERIODO_FIELDS} form={form} onChange={setField} />
                    <input
                        className="stc-field-input stc-captura-ancho"
                        aria-label="Descripción del periodo"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                    />
                </fieldset>
                <DataTable title="" className="stc-table-fit stc-captura-tabla" columns={COLUMNAS} rows={NO_ROWS} />
            </div>
        </CatalogoLayout>
    );
}
