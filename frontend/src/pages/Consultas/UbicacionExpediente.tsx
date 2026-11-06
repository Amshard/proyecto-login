import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { CamposOutline } from '../Catalogos/CatalogoCampos';
import { codeField, dateField, textField } from '../Catalogos/useCatalogo';
import { onlyDigits, replaceAt, useForm } from '../Procesos/procesoFields';
import './Consultas.css';

const FIELDS = [
    codeField('expediente', 'ㅤ', 5, { width: 60, numeric: true }),
    textField('nombre', 'ㅤ', 400, { maxLength: 50 }),
    dateField('fecha_ingreso', 'F Ingreso'),
    codeField('jub', 'Jub', 1, { width: 20 }),
];

const CAJAS = ['stc-consulta-chica', 'stc-consulta-mediana', 'stc-consulta-mediana'];
const SETS_VACIOS = [1, 2, 3, 4].map(() => CAJAS.map(() => ''));

const columnasVacias = (headers: string[]): Column<number>[] => headers.map((header) => ({ header, cell: () => null, center: true }));

const TABLA_COLUMNAS = columnasVacias(['Linea', 'Tramo', 'Pem', 'Taquilla', 'Tur', 'Categoria', 'Lugar', 'Descanso', 'Faltas', 'Calificacion']);
const TABLA_FILAS = Array.from({ length: 4 }, (_, i) => i);

const LATERAL_COLUMNAS = columnasVacias(['ROL']);

const GRUPOS = [
    { titulo: 'ROL VIGENTE', desde: 0, hasta: 1 },
    { titulo: 'Fechas de los Roles Anteriores del Año', desde: 1, hasta: 4 },
];

interface PeriodoColumna {
    titulo: string;
    clase: string;
    digitos?: number;
    fecha?: boolean;
}

const ANIO: PeriodoColumna = { titulo: 'Año', digitos: 4, clase: 'stc-consulta-anio' };
const PERIODO: PeriodoColumna[] = [
    { titulo: 'Pdo #', digitos: 1, clase: 'stc-consulta-pdo' },
    { titulo: 'Fecha ini', fecha: true, clase: 'stc-consulta-fecha' },
    { titulo: 'dias', digitos: 3, clase: 'stc-consulta-dias' },
];

const PERIODO_SETS = [
    [ANIO, ...PERIODO],
    [...PERIODO, { ...ANIO, titulo: 'Años' }],
];
const PERIODOS_VACIOS = PERIODO_SETS.map((columnas) => columnas.map(() => ['', '']));

export default function UbicacionExpediente() {
    const [form, setField, resetForm] = useForm(FIELDS);
    const [sets, setSets] = useState(SETS_VACIOS);
    const [periodos, setPeriodos] = useState(PERIODOS_VACIOS);

    const limpiar = () => {
        resetForm();
        setSets(SETS_VACIOS);
        setPeriodos(PERIODOS_VACIOS);
    };

    return (
        <CatalogoLayout
            tabLabel="UBICACIÓN POR EXPEDIENTE"
            hideTabs
            pageClassName="stc-consulta"
            statusLabel="Ubicación de un Expediente"
            onClear={limpiar}
            fields={<CamposOutline completo titulo="Expediente" fields={FIELDS} form={form} onChange={setField} />}
        >
            <div className="stc-consulta-sets">
                {GRUPOS.map(({ titulo, desde, hasta }) => (
                    <section key={titulo} className="stc-consulta-grupo">
                        <h2 className="stc-consulta-titulo">{titulo}</h2>
                        <div className="stc-consulta-grupo-sets">
                            {sets.slice(desde, hasta).map((cajas, i) => {
                                const set = desde + i;
                                return (
                                    <div key={set} className="stc-consulta-set">
                                        {cajas.map((valor, caja) => (
                                            <input
                                                key={caja}
                                                className={`stc-field-input ${CAJAS[caja]}`}
                                                aria-label={`${titulo} ${i + 1}, caja ${caja + 1}`}
                                                value={valor}
                                                onChange={(e) =>
                                                    setSets((prev) =>
                                                        replaceAt(prev, set, replaceAt(prev[set], caja, e.target.value))
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
            <section className="stc-consulta-historico">
                <h2 className="stc-consulta-titulo">Historico de Ubicacion en el ROL</h2>
                <div className="stc-consulta-tablas">
                    <DataTable title="" className="stc-consulta-tabla stc-consulta-lateral" columns={LATERAL_COLUMNAS} rows={TABLA_FILAS} />
                    <DataTable title="" className="stc-consulta-tabla" columns={TABLA_COLUMNAS} rows={TABLA_FILAS} />
                </div>
            </section>
            <fieldset className="stc-consulta-periodos">
                <legend className="stc-report-options-title">Vacaciones</legend>
                {periodos.map((columnas, set) => (
                    <div key={set} className="stc-consulta-periodo">
                        {PERIODO_SETS[set].map(({ titulo, digitos, fecha, clase }, col) => (
                            <div key={clase} className={`stc-consulta-columna ${clase}`}>
                                <span className="stc-field-label">{titulo.replace('#', String(set + 1))}</span>
                                {columnas[col].map((valor, caja) => (
                                    <input
                                        key={caja}
                                        className="stc-field-input"
                                        type={fecha ? 'date' : 'text'}
                                        inputMode={fecha ? undefined : 'numeric'}
                                        maxLength={digitos}
                                        aria-label={`${titulo} ${caja + 1}, conjunto ${set + 1}`}
                                        value={valor}
                                        onChange={(e) => {
                                            const nuevo = fecha ? e.target.value : onlyDigits(e.target.value);
                                            setPeriodos((prev) =>
                                                replaceAt(prev, set, replaceAt(prev[set], col, replaceAt(prev[set][col], caja, nuevo)))
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </fieldset>
        </CatalogoLayout>
    );
}
