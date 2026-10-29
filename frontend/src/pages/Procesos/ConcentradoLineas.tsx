import { useMemo, useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField } from '../Catalogos/useCatalogo';
import { DigitInput, RadioOptions, SideButtons } from './ProcesoControls';
import { NO_ROWS, fixedField, headersOnly, replaceAt, useForm } from './procesoFields';
import ProgressBar from './ProgressBar';
import './Procesos.css';

const RANGO_FIELDS = [
    codeField('inicial', 'Inicial', 5, { width: 60, numeric: true }),
    codeField('final', 'Final', 5, { width: 60, numeric: true }),
].map(fixedField);

const EMPTY_PARES = [1, 2, 3, 4].map(() => ({ rol: '', anio: '' }));

const OPCIONES = ['Concentrado', 'Detallado x Expediente'];

const EMPTY_ROLES = ['', '', '', ''];
const EMPTY_FECHAS = EMPTY_ROLES.map(() => ['', '']);

const HEADERS = ['Reg', 'Exp', 'Nombre', 'Lin', 'Tur', 'Lin', 'Tur', 'Lin', 'Tur', 'Lin', 'Tur', 'Lineas', 'Turnos'];
const BASE_COLUMNS = headersOnly(HEADERS);

const TUR_COLUMNS = HEADERS.flatMap((header, i) => (header === 'Tur' ? [i] : []));
const EMPTY_TUR_ROLES = TUR_COLUMNS.map(() => '');

export default function ConcentradoLineas() {
    const [rango, setRangoField, resetRango] = useForm(RANGO_FIELDS);
    const [pares, setPares] = useState(EMPTY_PARES);
    const [opcion, setOpcion] = useState('');
    const [roles, setRoles] = useState(EMPTY_ROLES);
    const [fechas, setFechas] = useState(EMPTY_FECHAS);
    const [progress, setProgress] = useState(0);
    const [turRoles, setTurRoles] = useState(EMPTY_TUR_ROLES);

    const columns = useMemo(
        () =>
            BASE_COLUMNS.map((column, i) => {
                const tur = TUR_COLUMNS.indexOf(i);
                if (tur < 0) return column;
                return {
                    ...column,
                    above: (
                        <label className="stc-table-above-field">
                            Rol
                            <DigitInput
                                label={`Rol ${tur + 1}`}
                                digitos={1}
                                fit={false}
                                value={turRoles[tur]}
                                onChange={(value) => setTurRoles((prev) => replaceAt(prev, tur, value))}
                            />
                        </label>
                    ),
                };
            }),
        [turRoles]
    );

    const setPar = (index: number, key: 'rol' | 'anio', value: string) =>
        setPares((prev) => replaceAt(prev, index, { ...prev[index], [key]: value }));
    const setFecha = (linea: number, caja: number, fecha: string) =>
        setFechas((prev) => replaceAt(prev, linea, replaceAt(prev[linea], caja, fecha)));

    const limpiar = () => {
        resetRango();
        setPares(EMPTY_PARES);
        setOpcion('');
        setRoles(EMPTY_ROLES);
        setFechas(EMPTY_FECHAS);
        setTurRoles(EMPTY_TUR_ROLES);
        setProgress(0);
    };

    return (
        <CatalogoLayout
            tabLabel="RANGO DE EXPEDIENTES"
            statusLabel="Rol de Lineas y Turnos por Expediente"
            actions={
                <>
                    <SideButtons
                        buttons={[{ label: 'Muestra la Informacion' }, { label: 'Limpiar', onClick: limpiar }, { label: 'Genera en Excel' }]}
                    />
                    <div className="stc-header-registros stc-actualiza-header-text">CONCENTRADO POR EXPEDIENTE DE LINEAS Y TURNOS</div>
                </>
            }
            fields={
                <>
                    <div className="stc-manual-fields">
                        <ManualFields className="stc-concentrado-rango" fields={RANGO_FIELDS} form={rango} onChange={setRangoField} />
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Roles y Años Participantes</span>
                            <div className="stc-concentrado-pares">
                                {pares.map(({ rol, anio }, i) => (
                                    <div key={i} className="stc-rango-cajas">
                                        <DigitInput label={`Rol ${i + 1}`} digitos={1} value={rol} onChange={(v) => setPar(i, 'rol', v)} />
                                        <DigitInput label={`Año ${i + 1}`} digitos={4} value={anio} onChange={(v) => setPar(i, 'anio', v)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="stc-concentrado-opciones">
                            <RadioOptions options={OPCIONES} value={opcion} onChange={setOpcion} />
                        </div>
                    </div>
                    <div className="stc-manual-fields stc-rango-lineas">
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Rol</span>
                            <div className="stc-rango-columna">
                                {roles.map((rol, i) => (
                                    <DigitInput
                                        key={i}
                                        label={`Rol ${i + 1}`}
                                        digitos={1}
                                        value={rol}
                                        onChange={(v) => setRoles((prev) => replaceAt(prev, i, v))}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Fechas Seleccionadas</span>
                            <div className="stc-rango-columna">
                                {fechas.map((par, linea) => (
                                    <div key={linea} className="stc-rango-cajas">
                                        {par.map((fecha, caja) => (
                                            <input
                                                key={caja}
                                                type="date"
                                                className="stc-field-input stc-rango-fecha"
                                                aria-label={`Fecha ${caja + 1} del Rol ${linea + 1}`}
                                                value={fecha}
                                                onChange={(e) => setFecha(linea, caja, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ProgressBar value={progress} />
                    </div>
                </>
            }
        >
            <DataTable title="" className="stc-table-fit" rowHeader columns={columns} rows={NO_ROWS} />
        </CatalogoLayout>
    );
}
