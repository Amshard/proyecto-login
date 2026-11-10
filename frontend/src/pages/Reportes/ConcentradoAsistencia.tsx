import { useState } from 'react';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField } from '../Catalogos/useCatalogo';
import { RadioOption } from '../Procesos/ProcesoControls';
import { campo } from '../Procesos/procesoFields';
import ProgressBar from '../Procesos/ProgressBar';
import ReportePage from './ReportePage';

const FIELDS = [
    campo(codeField('anio', 'Año', 4, { width: 40, numeric: true })),
    campo(codeField('catorcena', 'Catorcena', 2, { numeric: true })),
    { ...campo(textField('descripcion', 'Descripción', 300, { maxLength: 50 })), breakAfter: true },
    campo(textField('periodo', 'Periodo', 500, { maxLength: 80 })),
];

type CampoKey = (typeof FIELDS)[number]['key'];

const camposVacios = (): Record<CampoKey, string> => ({
    anio: String(new Date().getFullYear()),
    catorcena: '',
    descripcion: '',
    periodo: '',
});

const OPCIONES = ['Reporte Concentrado Del Rol Vigente', 'Reporte Concentrado en Blanco'];

const ACTUALIZA_DESCANSOS = 'Actualiza Descansos anteriores y Descansos del Rol Vigente';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const SEMANAS = [0, 1].map((semana) =>
    DIAS.map((dia, i) => campo(codeField(`dia${semana * 7 + i + 1}`, dia, 2, { width: 20, wrap: 20, numeric: true })))
);

const diasVacios = (): Record<string, string> =>
    Object.fromEntries(SEMANAS.flat().map(({ key }) => [key, '']));

export default function ConcentradoAsistencia() {
    const [campos, setCampos] = useState(camposVacios);
    const [dias, setDias] = useState(diasVacios);
    const [opcion, setOpcion] = useState('');

    const limpiar = () => {
        setCampos(camposVacios());
        setDias(diasVacios());
        setOpcion('');
    };

    return (
        <ReportePage
            tabLabel="CONCENTRADO DE ASISTENCIAS"
            statusLabel="Reporte Concentrado de Asistencia"
            titulo="Formato para Registro de Asistencia."
            opciones={OPCIONES}
            bloqueadas={OPCIONES}
            opcion={opcion}
            onOpcion={setOpcion}
            onClear={limpiar}
            arriba={
                <fieldset className="stc-reporte-parametros">
                    <legend className="stc-report-options-title">Parámetros</legend>
                    <ManualFields
                        className="stc-reporte-campos"
                        fields={FIELDS}
                        form={campos}
                        onChange={(key, value) => setCampos((prev) => ({ ...prev, [key]: value }))}
                    />
                    <div className="stc-reporte-semanas">
                        {SEMANAS.map((semana) => (
                            <ManualFields
                                key={semana[0].key}
                                className="stc-reporte-semana"
                                fields={semana}
                                form={dias}
                                onChange={(key, value) => setDias((prev) => ({ ...prev, [key]: value }))}
                            />
                        ))}
                    </div>
                </fieldset>
            }
        >
            <ProgressBar value={0} />
            <RadioOption
                label={ACTUALIZA_DESCANSOS}
                checked={opcion === ACTUALIZA_DESCANSOS}
                onCheck={() => setOpcion(ACTUALIZA_DESCANSOS)}
                disabled
            />
        </ReportePage>
    );
}
