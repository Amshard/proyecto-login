import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { ManualFields, type ManualFieldConfig } from '../../components/ManualField';
import { codeField, dateField, labelLeft, textField } from '../Catalogos/useCatalogo';
import { SideButtons } from '../Procesos/ProcesoControls';
import { fixedField, onlyDigits, replaceAt, sameHeight, useForm } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import './Consultas.css';

const FIELDS = [
    codeField('expediente', 'Expediente', 5, { width: 70, numeric: true }),
    textField('nombre', 'Nombre', 400, { maxLength: 50 }),
    dateField('ingreso', 'Ingreso'),
    codeField('permanencia', 'Permanencia', 2, { width: 40, numeric: true }),
].map((field) => sameHeight(fixedField(field)));

const SOLICITO_VACIO = ['', '', ''];

const PERIODO_FIELDS = [
    codeField('primer_periodo', 'ㅤ', 2, { width: 40, numeric: true }),
    labelLeft(dateField('inicia', 'Inicia')),
    labelLeft(dateField('termina', 'Termina')),
].map((field) => sameHeight(fixedField(field)));

const TIEMPO_FIELDS = [
    codeField('anios', 'Años', 2, { width: 40, numeric: true }),
    codeField('meses', 'Meses', 2, { width: 40, numeric: true }),
    codeField('dias', 'Dias', 2, { width: 40, numeric: true }),
    codeField('dias_vacaciones', 'Dias de Vacaciones', 2, { width: 40, numeric: true }),
].map((field) => sameHeight(fixedField(labelLeft(field))));

const PERIODO_FORM = [...PERIODO_FIELDS, ...TIEMPO_FIELDS];

// Each copy of the Solicito block gets its own field ids, so its labels point at its own boxes.
const conId = <T extends ManualFieldConfig<string>>(fields: T[], bloque: number) =>
    fields.map((field) => ({ ...field, id: `${field.id}-${bloque}` }));

const BLOQUES = [0, 1].map((bloque) => ({
    bloque,
    periodoFields: conId(PERIODO_FIELDS, bloque),
    tiempoFields: conId(TIEMPO_FIELDS, bloque),
}));

function SolicitoBloque({ bloque, periodoFields, tiempoFields }: (typeof BLOQUES)[number]) {
    const [solicito, setSolicito] = useState(SOLICITO_VACIO);
    const [periodo, setPeriodo] = useForm(PERIODO_FORM);

    return (
        <section className="stc-vacaciones-solicito">
            <h2 className="stc-consulta-titulo">Solicito</h2>
            {solicito.map((valor, i) => (
                <label key={i} className="stc-vacaciones-solicito-fila">
                    <span className="stc-field-label">{i + 1}</span>
                    <input
                        className="stc-field-input"
                        aria-label={`Solicito ${i + 1}, bloque ${bloque + 1}`}
                        inputMode="numeric"
                        maxLength={2}
                        value={valor}
                        onChange={(e) => setSolicito((prev) => replaceAt(prev, i, onlyDigits(e.target.value)))}
                    />
                </label>
            ))}
            <h2 className="stc-consulta-titulo stc-vacaciones-periodo-titulo">Primer periodo Asignado</h2>
            <ManualFields className="stc-vacaciones-periodo" fields={periodoFields} form={periodo} onChange={setPeriodo} />
            <h2 className="stc-consulta-titulo stc-vacaciones-periodo-titulo stc-vacaciones-tiempo-titulo">
                Antigüedad que cumplirá
            </h2>
            <ManualFields
                className="stc-vacaciones-periodo stc-vacaciones-tiempo"
                fields={tiempoFields}
                form={periodo}
                onChange={setPeriodo}
            />
        </section>
    );
}

export default function PeriodosVacacionales() {
    const [form, setField, resetForm] = useForm(FIELDS);
    const [vacio, setVacio] = useState(0);
    const [anio, setAnio] = useState(() => String(new Date().getFullYear()));

    const limpiar = () => {
        resetForm();
        setVacio((n) => n + 1);
    };

    const buscar = () => {};

    return (
        <CatalogoLayout
            tabLabel="PERIODOS VACACIONALES POR EXPEDIENTE"
            hideTabs
            pageClassName="stc-sin-bordes"
            statusLabel="Vacaciones por Expediente"
            count={0}
            headerText={
                <label className="stc-header-registros stc-registros-row stc-vacaciones-anio">
                    <span className="stc-registros-label">Año</span>
                    <input
                        className="stc-registros-box"
                        inputMode="numeric"
                        maxLength={4}
                        value={anio}
                        onChange={(e) => setAnio(onlyDigits(e.target.value))}
                    />
                </label>
            }
            actions={
                <SideButtons
                    buttons={[
                        { label: 'Buscar', onClick: buscar },
                        { label: 'Limpiar', onClick: limpiar },
                    ]}
                />
            }
        >
            <fieldset className="stc-reporte-outline">
                <legend className="stc-report-options-title">Consulta periodos Vacacionales</legend>
                <ManualFields
                    className="stc-vacaciones-fila"
                    fields={FIELDS}
                    form={form}
                    onChange={(key, value) => setField(key, key === 'nombre' ? value.toUpperCase() : value)}
                />
                {BLOQUES.map((campos) => (
                    <SolicitoBloque key={`${campos.bloque}-${vacio}`} {...campos} />
                ))}
            </fieldset>
        </CatalogoLayout>
    );
}
