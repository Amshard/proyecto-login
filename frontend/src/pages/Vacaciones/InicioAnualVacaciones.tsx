import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { ManualField } from '../../components/ManualField';
import { codeField, labelLeft } from '../Catalogos/useCatalogo';
import ProcesoOption from '../Procesos/ProcesoOption';
import { fixedField, sameHeight, useForm } from '../Procesos/procesoFields';
import ProgressBar from '../Procesos/ProgressBar';
import '../Procesos/Procesos.css';
import '../Reportes/Reportes.css';
import './Vacaciones.css';

const INICIA = 'INICIA EL PROGRAMA ANUAL DE VACACIONES';

const FIELDS = [
    codeField('anio', 'Año', 4, { width: 60, numeric: true }),
    codeField('con_solicitud', 'Con Solicitud', 5, { width: 70, numeric: true }),
    codeField('periodos', 'Periodos', 2, { width: 60, numeric: true }),
    codeField('sin_solicitud', 'Sin Solicitud', 5, { width: 70, numeric: true }),
].map((field) => sameHeight(fixedField(labelLeft(field))));

export default function InicioAnualVacaciones() {
    const [checked, setChecked] = useState(false);
    const [form, setField] = useForm(FIELDS);

    return (
        <CatalogoLayout
            tabLabel="INICIO ANUAL DE VACACIONES"
            hideTabs
            statusLabel="Inicia Programa Vacacional"
            pageClassName="stc-sin-bordes"
        >
            <fieldset className="stc-reporte-outline stc-vacaciones-outline">
                <legend className="stc-report-options-title">Programa Vacacional</legend>
                <div className="stc-vacaciones-campos">
                    {FIELDS.map((config) => (
                        <ManualField
                            key={config.key}
                            config={config}
                            value={form[config.key]}
                            onChange={(value) => setField(config.key, value)}
                        />
                    ))}
                </div>
                <ProcesoOption
                    label={INICIA}
                    checked={checked}
                    onCheck={() => setChecked(true)}
                />
                <ProgressBar value={0} />
            </fieldset>
        </CatalogoLayout>
    );
}
