import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { ManualFields } from '../../components/ManualField';
import { dateField, labelLeft, textField } from '../Catalogos/useCatalogo';
import { SideButtons } from '../Procesos/ProcesoControls';
import { campoIzq, conId, fixedField, numero, useForm } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import './Vacaciones.css';

const ANIO_FIELDS = [campoIzq(numero('anio', 'Año', 4, 60))];

const EXPEDIENTE_FIELDS = [
    campoIzq(numero('expediente', 'Expediente', 5, 70)),
    campoIzq(textField('nombre', 'Nombre', 400, { maxLength: 50 })),
    campoIzq(dateField('ingreso', 'Ingreso')),
];

const PERIODO_FIELDS = [
    campoIzq(numero('periodo', '', 2, 40)),
    campoIzq(dateField('inicia', 'Inicia')),
];

const chico = <K extends string>(key: K, label: string) => fixedField(labelLeft(numero(key, label, 2, 40)));

const TIEMPO_FIELDS = [
    chico('anios', 'Años'),
    chico('meses', 'Meses'),
    chico('dias', 'Dias'),
    chico('dias_vacaciones', 'Dias de Vacaciones'),
];

const FIELDS = [...ANIO_FIELDS, ...EXPEDIENTE_FIELDS];
const LINEA_FORM = [...PERIODO_FIELDS, ...TIEMPO_FIELDS];

const LINEAS = ['Primer Periodo Asignado 01 al 13', 'Segundo Periodo Asignado 14 al 26'].map((titulo, linea) => ({
    linea,
    titulo,
    periodoFields: conId(PERIODO_FIELDS, linea),
    tiempoFields: conId(TIEMPO_FIELDS, linea),
}));

function LineaPeriodo({ titulo, periodoFields, tiempoFields }: (typeof LINEAS)[number]) {
    const [form, setField] = useForm(LINEA_FORM);

    return (
        <div className="stc-reasigna-bloques">
            <section className="stc-reasigna-periodo">
                <h2 className="stc-reasigna-titulo">{titulo}</h2>
                <ManualFields className="stc-reasigna-campos" fields={periodoFields} form={form} onChange={setField} />
            </section>
            <section className="stc-reasigna-periodo">
                <h2 className="stc-reasigna-titulo">Antigüedad que Cumplirá</h2>
                <ManualFields className="stc-reasigna-campos stc-reasigna-tiempo" fields={tiempoFields} form={form} onChange={setField} />
            </section>
        </div>
    );
}

export default function ReasignaPeriodos() {
    const [form, setField, reset] = useForm(FIELDS);
    const [vacio, setVacio] = useState(0);
    const cambia = (key: (typeof FIELDS)[number]['key'], value: string) =>
        setField(key, key === 'nombre' ? value.toUpperCase() : value);

    const limpiar = () => {
        reset();
        setVacio((n) => n + 1);
    };

    return (
        <CatalogoLayout
            tabLabel="RE-ASIGNA PERIODOS VACACIONALES POR EXPEDIENTE"
            hideTabs
            pageClassName="stc-sin-bordes"
            statusLabel="Re-Asigna Periodos Vacacionales por Expediente"
            count={0}
            anio
            actions={
                <SideButtons
                    buttons={[
                        { label: 'Limpiar', onClick: limpiar },
                        { label: 'Modificar' },
                        { label: 'Eliminar' },
                    ]}
                />
            }
        >
            <fieldset className="stc-reporte-outline">
                <legend className="stc-report-options-title">ReAsignación de Periodos Vacacionales por Expediente</legend>
                <ManualFields className="stc-reasigna-campos" fields={ANIO_FIELDS} form={form} onChange={cambia} />
                <ManualFields className="stc-reasigna-campos" fields={EXPEDIENTE_FIELDS} form={form} onChange={cambia} />
                {LINEAS.map((linea) => (
                    <LineaPeriodo key={`${vacio}-${linea.linea}`} {...linea} />
                ))}
            </fieldset>
        </CatalogoLayout>
    );
}
