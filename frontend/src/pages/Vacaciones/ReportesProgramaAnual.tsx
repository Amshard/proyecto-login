import { useState } from 'react';
import { ManualFields } from '../../components/ManualField';
import { RadioOption } from '../Procesos/ProcesoControls';
import { fixedField, numero, useForm } from '../Procesos/procesoFields';
import ReportePage from '../Reportes/ReportePage';
import './Vacaciones.css';

const OPCIONES = [
    'General (Alfabetico)',
    'Por Permanencia (Alfabético)',
    'Por Permanencia y Periodo (Alfabético)',
    'Totales por Periodo y Permanencia'
];

const RANGO_FIELDS = [
    numero('expediente_inicial', 'Expediente Inicial', 5, 60),
    numero('expediente_final', 'Expediente Final', 5, 60),
].map(fixedField);

const POR_RANGO = 'Historico de Vacaciones';

export default function ReportesProgramaAnual() {
    const [opcion, setOpcion] = useState('');
    const [rango, setRango] = useForm(RANGO_FIELDS);

    return (
        <ReportePage
            tabLabel="REPORTES DEL PROGRAMA ANUAL"
            statusLabel="Reportes del Programa Anual"
            titulo="Emisión de Reportes"
            subtitulo="Programa Anual de Vacaciones"
            opciones={OPCIONES}
            anio
            opcion={opcion}
            onOpcion={setOpcion}
            enOpciones={
                <fieldset className="stc-programa-rango-set">
                    <ManualFields className="stc-programa-rango" fields={RANGO_FIELDS} form={rango} onChange={setRango} />
                    <div className="stc-programa-rango-opcion">
                        <RadioOption label={POR_RANGO} checked={opcion === POR_RANGO} onCheck={() => setOpcion(POR_RANGO)} />
                    </div>
                </fieldset>
            }
        />
    );
}
