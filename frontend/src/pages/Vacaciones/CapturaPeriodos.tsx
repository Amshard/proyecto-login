import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualField } from '../../components/ManualField';
import { codeField, dateField } from '../Catalogos/useCatalogo';
import { NO_ROWS, fixedField, headersOnly, sameHeight, useForm } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import { reporteTab } from './reporteTab';
import './Vacaciones.css';

const ANIO_FIELD = sameHeight(fixedField(codeField('anio', 'Año', 4, { width: 60, numeric: true })));

const PERIODO_FIELDS = [
    codeField('numero', 'Numero', 2, { width: 50, numeric: true }),
    dateField('del', 'Del'),
    dateField('al', 'Al'),
].map((field) => sameHeight(fixedField(field)));

const FIELDS = [ANIO_FIELD, ...PERIODO_FIELDS];

const COLUMNAS = headersOnly(['Año', 'Periodo', 'Del', 'Al', 'Descripción Periodo']);

export default function CapturaPeriodos() {
    const [form, setField] = useForm(FIELDS);
    const [nota, setNota] = useState('');

    // Pending: build the PDF once the periods come from the API.
    const generarReporte = () => {};
    const guardar = () => {};

    const campo = (config: (typeof FIELDS)[number]) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={(value) => setField(config.key, value)} />
    );

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
                    {campo(ANIO_FIELD)}
                    <div className="stc-captura-fila">{PERIODO_FIELDS.map(campo)}</div>
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
