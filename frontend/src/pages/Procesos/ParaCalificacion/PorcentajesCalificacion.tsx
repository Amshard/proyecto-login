import { Fragment, useState } from 'react';
import { ManualField, type ManualFieldConfig } from '../../../components/ManualField';
import { codeField, dateField, textField } from '../../Catalogos/useCatalogo';
import { DigitInput } from '../ProcesoControls';
import { fixedField, replaceAt, useForm } from '../procesoFields';
import '../Procesos.css';

const EXPEDIENTE_FIELD = fixedField(codeField('expediente', 'Expediente', 5, { width: 90, numeric: true }));
const NOMBRE_FIELD = fixedField(textField('nombre', 'Nombre', 420, { maxLength: 50 }));

const ANIOS_FIELD = fixedField(codeField('anios', 'Años', 2, { width: 30, numeric: true }));

const INCIDENCIA_KEYS = ['fecha_ingreso', 'faltas', 'retardos', 'roles_turno', 'roles_linea'] as const;
type IncidenciaKey = (typeof INCIDENCIA_KEYS)[number];
const INCIDENCIAS = INCIDENCIA_KEYS.map((key) => ({ key }));

const cuenta = (key: IncidenciaKey, label: string) => fixedField(codeField(key, label, 3, { width: 50, numeric: true }));

const CONCEPTOS: { concepto: string; porcentaje: number; campo?: ManualFieldConfig<IncidenciaKey>; nota?: string }[] = [
    { concepto: 'Antigüedad en el STC', porcentaje: 15, campo: fixedField(dateField('fecha_ingreso', 'Fecha de Ingreso')) },
    { concepto: 'Puntualidad', porcentaje: 30, campo: cuenta('faltas', 'Faltas') },
    { concepto: 'Asistencia', porcentaje: 20, campo: cuenta('retardos', 'Retardos') },
    { concepto: 'Antigüedad en el Turno', porcentaje: 10, campo: cuenta('roles_turno', 'Roles en Turno') },
    { concepto: 'Antigüedad en la Línea', porcentaje: 10, campo: cuenta('roles_linea', 'Roles en Linea') },
    { concepto: 'Meritos', porcentaje: 15, nota: '= Sanciones + Faltante de efectivo + Frecuencia' },
];

type MeritoKey = 'amones' | 'notas' | 'suspens' | 'monto' | 'veces';

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

const PARTES = MERITOS.flatMap(({ partes }) => partes);

interface PorcentajesCalificacionProps {
    titulo: string;
    consulta?: boolean;
}

export default function PorcentajesCalificacion({ titulo, consulta }: PorcentajesCalificacionProps) {
    const [expediente, setExpediente] = useState('');
    const [nombre, setNombre] = useState('');
    const [incidencias, setIncidencia] = useForm(INCIDENCIAS);
    const [sanciones, setSanciones] = useState('');
    const [anios, setAnios] = useState('');
    const [puntos, setPuntos] = useState(() => CONCEPTOS.map(() => ''));
    const [calificacion, setCalificacion] = useState('');
    const [meritoPuntos, setMeritoPuntos] = useState(() => MERITOS.map(() => ''));
    const [meritos, setMerito] = useForm(PARTES);

    return (
        <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide stc-actualiza-options">
            <legend className="stc-report-options-title">{titulo}</legend>
            <div className="stc-actualiza-contenido">
                <div className="stc-actualiza-fields">
                    <ManualField config={EXPEDIENTE_FIELD} value={expediente} onChange={setExpediente} />
                    <ManualField config={NOMBRE_FIELD} value={nombre} onChange={(v) => setNombre(v.toUpperCase())} />
                </div>
                <div className={`stc-actualiza-conceptos${consulta ? " stc-actualiza-con-puntos" : ""}`}>
                    <h2 className="stc-actualiza-heading">PORCENTAJES DE CALIFICACIÓN</h2>
                    {consulta && <span className="stc-roles-text stc-actualiza-columna-titulo">PUNTOS OBTENIDOS</span>}
                    {CONCEPTOS.map(({ concepto, porcentaje, campo, nota }, fila) => (
                        <Fragment key={concepto}>
                            <span className="stc-roles-text stc-actualiza-concepto">{concepto}</span>
                            <span className="stc-roles-text">{porcentaje}%</span>
                            {campo && (
                                <div className="stc-actualiza-campos">
                                    <ManualField
                                        config={campo}
                                        value={incidencias[campo.key]}
                                        onChange={(value) => setIncidencia(campo.key, value)}
                                    />
                                    {consulta && campo.key === 'fecha_ingreso' && (
                                        <ManualField config={ANIOS_FIELD} value={anios} onChange={setAnios} />
                                    )}
                                </div>
                            )}
                            {nota && <span className="stc-roles-text">{nota}</span>}
                            {consulta && (
                                <input
                                    className="stc-field-input stc-actualiza-punto"
                                    aria-label={`Puntos obtenidos, ${concepto}`}
                                    inputMode="decimal"
                                    maxLength={6}
                                    value={puntos[fila]}
                                    onChange={(e) => {
                                        const valor = e.target.value.replace(/[^\d.]/g, '');
                                        setPuntos((prev) => replaceAt(prev, fila, valor));
                                    }}
                                />
                            )}
                        </Fragment>
                    ))}
                    <span className="stc-roles-text stc-actualiza-total">100%</span>
                    {consulta && (
                        <>
                            <span className="stc-roles-text stc-actualiza-calificacion-titulo">CALIFICACION=</span>
                            <div className="stc-actualiza-calificacion">
                                <input
                                    className="stc-field-input stc-actualiza-punto"
                                    aria-label="Calificación"
                                    inputMode="decimal"
                                    maxLength={6}
                                    value={calificacion}
                                    onChange={(e) => setCalificacion(e.target.value.replace(/[^0-9.]/g, ''))}
                                />
                            </div>
                        </>
                    )}
                    <div className="stc-actualiza-separador" />
                    {MERITOS.map(({ concepto, porcentaje, partes }, fila) => (
                        <Fragment key={concepto}>
                            <span className="stc-roles-text stc-actualiza-concepto">
                                {concepto}
                                {concepto === 'Sanciones' && (
                                    <DigitInput
                                        className="stc-actualiza-sanciones"
                                        label="Sanciones"
                                        digitos={2}
                                        fit={false}
                                        value={sanciones}
                                        onChange={setSanciones}
                                    />
                                )}
                            </span>
                            <span className="stc-roles-text">{porcentaje}%</span>
                            <div className="stc-actualiza-partes">
                                {partes.map(({ texto, key, digitos }) => (
                                    <Fragment key={key}>
                                        <span className="stc-actualiza-parte-texto">{texto}</span>
                                        <DigitInput
                                            className="stc-actualiza-parte-input"
                                            label={`${concepto} ${texto.replace(/^[=+]\s*/, '')}`}
                                            digitos={digitos}
                                            value={meritos[key]}
                                            onChange={(value) => setMerito(key, value)}
                                        />
                                    </Fragment>
                                ))}
                            </div>
                            {consulta && (
                                <DigitInput
                                    className="stc-actualiza-parte-input stc-actualiza-merito-punto"
                                    label={`Puntos, ${concepto}`}
                                    digitos={2}
                                    fit={false}
                                    value={meritoPuntos[fila]}
                                    onChange={(value) => setMeritoPuntos((prev) => replaceAt(prev, fila, value))}
                                />
                            )}
                        </Fragment>
                    ))}
                    <span className="stc-roles-text stc-actualiza-total">15%</span>
                </div>
            </div>
        </fieldset>
    );
}
