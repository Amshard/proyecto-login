import { Fragment, useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import { ManualField, type ManualFieldConfig } from '../../../components/ManualField';
import { codeField, dateField, textField } from '../../Catalogos/useCatalogo';
import '../Procesos.css';

// With the label beside the box: the field sizes to label + box (the helpers' inline flex basis
// only counts the box), and the box keeps its own width instead of stretching to the field's.
const labelBeside = <T extends string>(field: ManualFieldConfig<T>) => ({
    ...field,
    wrapStyle: { flex: 'none' },
    inputStyle: { ...field.inputStyle, width: field.inputStyle?.maxWidth },
});

const EXPEDIENTE_FIELD = labelBeside(codeField('expediente', 'Expediente', 5, { width: 90, numeric: true }));
const NOMBRE_FIELD = labelBeside(textField('nombre', 'Nombre', 420, { maxLength: 50 }));

type IncidenciaKey = 'fecha_ingreso' | 'faltas' | 'retardos' | 'roles_turno' | 'roles_linea';

const cuenta = (key: IncidenciaKey, label: string) => labelBeside(codeField(key, label, 3, { width: 50, numeric: true }));

const CONCEPTOS: { concepto: string; porcentaje: number; campo?: ManualFieldConfig<IncidenciaKey>; nota?: string }[] = [
    { concepto: 'Antigüedad en el STC', porcentaje: 15, campo: labelBeside(dateField('fecha_ingreso', 'Fecha de Ingreso')) },
    { concepto: 'Puntualidad', porcentaje: 30, campo: cuenta('faltas', 'Faltas') },
    { concepto: 'Asistencia', porcentaje: 20, campo: cuenta('retardos', 'Retardos') },
    { concepto: 'Antigüedad en el Turno', porcentaje: 10, campo: cuenta('roles_turno', 'Roles en Turno') },
    { concepto: 'Antigüedad en la Línea', porcentaje: 10, campo: cuenta('roles_linea', 'Roles en Linea') },
    { concepto: 'Meritos', porcentaje: 15, nota: '= Sanciones + Faltante de efectivo + Frecuencia' },
];

type MeritoKey = 'amones' | 'notas' | 'suspens' | 'monto' | 'veces';

// What Meritos is made of, shown under the 100% total. Each line's third column is
// a run of text pieces, each followed by a numbers-only box of the given digits.
const MERITOS: { concepto: string; porcentaje: number; partes: { texto: string; key: MeritoKey; digitos: number }[] }[] = [
    {
        concepto: 'Sanciones',
        porcentaje: 5,
        partes: [
            { texto: '=Amones', key: 'amones', digitos: 1 },
            { texto: '+ Notas', key: 'notas', digitos: 1 },
            { texto: '+ Suspens', key: 'suspens', digitos: 1 },
        ],
    },
    { concepto: 'Faltante de Efectivo', porcentaje: 6, partes: [{ texto: 'Monto $', key: 'monto', digitos: 10 }] },
    { concepto: 'Frecuencia', porcentaje: 4, partes: [{ texto: 'Veces', key: 'veces', digitos: 2 }] },
];

const EMPTY_MERITOS: Record<MeritoKey, string> = { amones: '', notas: '', suspens: '', monto: '', veces: '' };

const EMPTY_INCIDENCIAS: Record<IncidenciaKey, string> = {
    fecha_ingreso: '',
    faltas: '',
    retardos: '',
    roles_turno: '',
    roles_linea: '',
};

export default function ActualizaIncidencias() {
    const [expediente, setExpediente] = useState('');
    const [nombre, setNombre] = useState('');
    const [incidencias, setIncidencias] = useState(EMPTY_INCIDENCIAS);
    const [sanciones, setSanciones] = useState('');
    const [meritos, setMeritos] = useState(EMPTY_MERITOS);

    const limpiar = () => {
        setExpediente('');
        setNombre('');
        setIncidencias(EMPTY_INCIDENCIAS);
        setSanciones('');
        setMeritos(EMPTY_MERITOS);
    };

    // Guardar has no action yet.
    const guardar = () => {};

    return (
        <CatalogoLayout
            tabLabel="ACTUALIZA INCIDENCIAS"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Actualiza Incidencias X Expediente"
            onClear={limpiar}
            onSave={guardar}
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide stc-actualiza-options">
                <legend className="stc-report-options-title">ALTA O MODIFICACION DE INCIDENCIAS POR EXPEDIENTE</legend>
                <div className="stc-actualiza-contenido">
                    <div className="stc-actualiza-fields">
                        <ManualField config={EXPEDIENTE_FIELD} value={expediente} onChange={setExpediente} />
                        <ManualField config={NOMBRE_FIELD} value={nombre} onChange={(v) => setNombre(v.toUpperCase())} />
                    </div>
                    <h2 className="stc-actualiza-heading">PORCENTAJES DE CALIFICACIÓN</h2>
                    <div className="stc-actualiza-conceptos">
                        {CONCEPTOS.map(({ concepto, porcentaje, campo, nota }) => (
                            <Fragment key={concepto}>
                                <span className="stc-roles-text stc-actualiza-concepto">{concepto}</span>
                                <span className="stc-roles-text">{porcentaje}%</span>
                                {campo && (
                                    <ManualField
                                        config={campo}
                                        value={incidencias[campo.key]}
                                        onChange={(value) => setIncidencias((prev) => ({ ...prev, [campo.key]: value }))}
                                    />
                                )}
                                {nota && <span className="stc-roles-text">{nota}</span>}
                            </Fragment>
                        ))}
                        <span className="stc-roles-text stc-actualiza-total">100%</span>
                        <div className="stc-actualiza-separador" />
                        {MERITOS.map(({ concepto, porcentaje, partes }) => (
                            <Fragment key={concepto}>
                                <span className="stc-roles-text stc-actualiza-concepto">
                                    {concepto}
                                    {concepto === 'Sanciones' && (
                                        <input
                                            className="stc-field-input stc-actualiza-sanciones"
                                            aria-label="Sanciones"
                                            inputMode="numeric"
                                            maxLength={2}
                                            value={sanciones}
                                            onChange={(e) => setSanciones(e.target.value.replace(/\D/g, ''))}
                                        />
                                    )}
                                </span>
                                <span className="stc-roles-text">{porcentaje}%</span>
                                <div className="stc-actualiza-partes">
                                    {partes.map(({ texto, key, digitos }) => (
                                        <Fragment key={key}>
                                            <span className="stc-actualiza-parte-texto">{texto}</span>
                                            <input
                                                className="stc-field-input stc-actualiza-parte-input"
                                                aria-label={`${concepto} ${texto.replace(/^[=+]\s*/, '')}`}
                                                inputMode="numeric"
                                                maxLength={digitos}
                                                // About 1ch per digit, plus room for the padding and border.
                                                style={{ width: `calc(${digitos}ch + 26px)` }}
                                                value={meritos[key]}
                                                onChange={(e) =>
                                                    setMeritos((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, '') }))
                                                }
                                            />
                                        </Fragment>
                                    ))}
                                </div>
                            </Fragment>
                        ))}
                        <span className="stc-roles-text stc-actualiza-total">15%</span>
                    </div>
                </div>
            </fieldset>
        </CatalogoLayout>
    );
}
