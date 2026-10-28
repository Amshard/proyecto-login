import { useMemo, useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import { getLineas } from '../../api/catalogos';
import { CODE_CHARS, codeField, isCodePrefix, lineaName, padCode, textField, useCatalogoRows } from '../Catalogos/useCatalogo';
import './Procesos.css';

// Content width for 5 characters, so those boxes are just long enough for them.
const FIVE_CHARS = 60;

// A code box that keeps its size: it doesn't shrink when the strip runs short of room
// (the untitled box gives way instead), and its box keeps its own width inside the field.
const fixed = <T extends string>(field: ManualFieldConfig<T>): ManualFieldConfig<T> => ({
    ...field,
    wrapStyle: { flex: 'none' },
    inputStyle: { ...field.inputStyle, width: field.inputStyle?.maxWidth },
});

const EXPEDIENTE_FIELD = fixed(codeField('expediente', 'Expediente', 5, { width: FIVE_CHARS, numeric: true }));
const POSICION_FIELD = fixed(codeField('posicion', 'Posicion', 5, { width: FIVE_CHARS, numeric: true }));
// Beside the table; it keeps its width instead of shrinking for the table.
const NVA_POSICION_FIELD = fixed(codeField('nva_posicion', 'Nva Posicion', 5, { width: 90, numeric: true }));
const TRAMO_FIELD =fixed(codeField('tramo', 'Tramo', 5, { width: FIVE_CHARS }));
// No title: the blank label keeps its box level with the others. Same height as the code boxes.
const DETALLE = textField('detalle', 'ㅤ', 800, { maxLength: 50 });
// It sits in a column with the row of boxes under it, so it drops the helper's flex basis (in a column that sets its height).
const DETALLE_FIELD = { ...DETALLE, wrapStyle: {}, inputStyle: { ...DETALLE.inputStyle, height: 30, width: 425 } };
// The row under the untitled box.
const MIDDLE_SUB_FIELDS = [
    fixed(codeField('categoria', 'Categoría', 5, { width: FIVE_CHARS })),
    fixed(codeField('descansos', 'Descansos', 5, { width: FIVE_CHARS })),
    fixed(codeField('lugar', 'Lugar', 2, { width: 20, numeric: true })),
    fixed(codeField('calificacion', 'Calificacion', 5, { width: FIVE_CHARS, allowedChars: '0123456789.' })),
];
type MiddleSubKey = (typeof MIDDLE_SUB_FIELDS)[number]['key'];
const EMPTY_MIDDLE_SUB: Record<MiddleSubKey, string> = { categoria: '', descansos: '', lugar: '', calificacion: '' };

const FALTAS_FIELD =fixed(codeField('faltas', 'Faltas', 2, { width: 50, numeric: true }));
const TAQUILLA_FIELD = fixed(codeField('taquilla', 'Taquilla', 5, { width: FIVE_CHARS, numeric: true }));
// The row under Faltas and Taquilla: one character each.
const RIGHT_SUB_FIELDS = [
    fixed(codeField('turno', 'Turno', 1, { width: 30 })),
    fixed(codeField('perm', 'Perm.', 1, { width: 30 })),
    fixed(codeField('jubdo', 'Jubdo', 1, { width: 30 })),
];
type RightSubKey = (typeof RIGHT_SUB_FIELDS)[number]['key'];
const EMPTY_RIGHT_SUB: Record<RightSubKey, string> = { turno: '', perm: '', jubdo: '' };

const HEADERS = [
    'Reg',
    'Nva P',
    'Exp',
    'Tramo',
    'Fat',
    'Tquilla',
    'Catg',
    'Des',
    'Lg',
    'Calif',
    'Tu',
    'Pem',
    'P Ant',
];

// Headers only: the tables are not linked to any data, so they stay empty.
const headersOnly = (headers: string[]): Column<never>[] => headers.map((header) => ({ header, cell: () => null, center: true }));

const COLUMNS = headersOnly(HEADERS);

// Tramos sin Expediente tab: the first 7 columns are row headers (orange).
const TRAMOS_COLUMNS = headersOnly([
    'Posicion',
    'Tramo',
    'Taquilla',
    'Turno',
    'Categoria',
    'Lugar',
    'Descanso',
    'Expediente',
    'Permanencia',
]);
const TRAMOS_HEADER_COLS = 7;
// The untitled box between those radios: a línea from cat_lineas, picked from a list or typed.
// Locked unless Por Línea is checked.
const TRAMOS_LINEA_FIELD = {
    ...codeField('linea', '', 2, { width: 60, padTo: 2, allowedChars: CODE_CHARS }),
    optionsButton: true,
};
// Placeholder labels for the two radios above that table.
const TRAMOS_OPCIONES = ['Por Línea', 'Todas las Líneas'];
// The blue line under the radios says what the table holds.
const TRAMOS_CLASIFICACION = 'Clasificada por: Permanencia, Tramo, Turno y lugar';

// Expedientes sin Lugar tab: placeholder names for its 6 headers and its two radios.
const SIN_LUGAR_COLUMNS = headersOnly(['Reg', 'Exp', 'Nombre', 'Fecha Ing', 'Jub', 'FoM']);
const SIN_LUGAR_OPCIONES = ['Por Expediente', 'Por Alfabético'];

// Header column slots, top to bottom: narrow buttons, closer together than the Catálogos ones.
const BUTTON_TOP = 220;
const BUTTON_STEP = 55;

export default function CambioPosiciones() {
    const rows: never[] = [];
    const [expediente, setExpediente] = useState('');
    const [posicion, setPosicion] = useState('');
    const [tramo, setTramo] = useState('');
    const [detalle, setDetalle] = useState('');
    const [faltas, setFaltas] = useState('');
    const [taquilla, setTaquilla] = useState('');
    const [rightSub, setRightSub] = useState(EMPTY_RIGHT_SUB);
    const [middleSub, setMiddleSub] = useState(EMPTY_MIDDLE_SUB);
    const [nvaPosicion, setNvaPosicion] = useState('');
    const [verCambios, setVerCambios] = useState(false);
    const [tramosOpcion, setTramosOpcion] = useState('');
    const [sinLugarOpcion, setSinLugarOpcion] = useState('');
    const [tramosLinea, setTramosLinea] = useState('');
    const [lineas] = useCatalogoRows(getLineas);
    const tramosLineaField = useMemo(() => {
        const codes = lineas.map((l) => l.id_linea);
        return {
            ...TRAMOS_LINEA_FIELD,
            options: lineas.map((l) => ({ value: l.id_linea, label: lineaName(l) })),
            accept: (v: string) => isCodePrefix(v, codes),
        };
    }, [lineas]);

    const lineaElegida = lineas.find((l) => l.id_linea === padCode(tramosLinea));
    const tramosLeyenda =
        tramosOpcion === TRAMOS_OPCIONES[1]
            ? `EN TODO EL ROL ${TRAMOS_CLASIFICACION}`
            : tramosOpcion === TRAMOS_OPCIONES[0] && lineaElegida
              ? `${lineaName(lineaElegida)} ${TRAMOS_CLASIFICACION}`
              : '';

    const tramosRadio = (label: string) => (
        <label className="stc-report-option">
            <input
                type="radio"
                checked={tramosOpcion === label}
                onChange={() => {
                    setTramosOpcion(label);
                    // Leaving Por Línea locks the box, so it doesn't keep a línea it no longer applies to.
                    if (label !== TRAMOS_OPCIONES[0]) setTramosLinea('');
                }}
            />
            {label}
        </label>
    );

    const limpiar = () => {
        setExpediente('');
        setPosicion('');
        setTramo('');
        setDetalle('');
        setMiddleSub(EMPTY_MIDDLE_SUB);
        setFaltas('');
        setTaquilla('');
        setRightSub(EMPTY_RIGHT_SUB);
        setNvaPosicion('');
        setVerCambios(false);
        setTramosOpcion('');
        setSinLugarOpcion('');
        setTramosLinea('');
    };

    // Only Limpiar has an action yet.
    const buttons = [
        { label: 'Limpiar', onClick: limpiar },
        { label: 'Guarda Los Cbios', onClick: undefined },
        { label: 'Regresa Cbios', onClick: undefined },
        { label: 'Ver Reporte', onClick: undefined },
    ];

    return (
        <CatalogoLayout
            tabLabel="Cambio de Lugares"
            statusLabel="Realizados Antes y Despues de Cambios"
            actionsOnAllTabs
            actions={buttons.map(({ label, onClick }, i) => (
                <button
                    key={label}
                    type="button"
                    className="stc-btn stc-exit-btn stc-carga-btn"
                    style={{ top: BUTTON_TOP + i * BUTTON_STEP }}
                    onClick={onClick}
                >
                    {label}
                </button>
            ))}
            extraTabs={[
                {
                    label: 'Tramos sin Expediente',
                    content: (
                        <DataTable
                            title=""
                            className="stc-table-posiciones"
                            rowHeader={TRAMOS_HEADER_COLS}
                            columns={TRAMOS_COLUMNS}
                            rows={rows}
                            // Inside the table's outline: the two radios with the línea box between them,
                            // and the blue text saying what the table holds.
                            header={
                                <div className="stc-tramos-panel">
                                    <div className="stc-tramos-opciones">
                                        {tramosRadio(TRAMOS_OPCIONES[0])}
                                        <ManualField
                                            config={tramosLineaField}
                                            value={tramosLinea}
                                            onChange={setTramosLinea}
                                            readOnly={tramosOpcion !== TRAMOS_OPCIONES[0]}
                                        />
                                        {tramosRadio(TRAMOS_OPCIONES[1])}
                                    </div>
                                    {tramosLeyenda && <p className="stc-tramos-leyenda">{tramosLeyenda}</p>}
                                </div>
                            }
                        />
                    ),
                },
                {
                    label: 'Expedientes sin Lugar',
                    content: (
                        <DataTable
                            title=""
                            className="stc-table-posiciones"
                            rowHeader
                            columns={SIN_LUGAR_COLUMNS}
                            rows={rows}
                            // Inside the table's outline: the two radios.
                            header={
                                <div className="stc-tramos-panel">
                                    <div className="stc-tramos-opciones">
                                        {SIN_LUGAR_OPCIONES.map((label) => (
                                            <label key={label} className="stc-report-option">
                                                <input
                                                    type="radio"
                                                    checked={sinLugarOpcion === label}
                                                    onChange={() => setSinLugarOpcion(label)}
                                                />
                                                {label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            }
                        />
                    ),
                },
            ]}
            fields={
                <div className="stc-manual-fields stc-posiciones-fields">
                    <ManualField config={EXPEDIENTE_FIELD} value={expediente} onChange={setExpediente} />
                    <div className="stc-posiciones-row stc-posiciones-middle">
                        <ManualField config={POSICION_FIELD} value={posicion} onChange={setPosicion} />
                        <ManualField config={TRAMO_FIELD} value={tramo} onChange={setTramo} />
                        {/* The untitled box with Categoría, Descansos, Lugar and Calificacion under it. */}
                        <div className="stc-posiciones-group">
                            <ManualField config={DETALLE_FIELD} value={detalle} onChange={setDetalle} />
                            <div className="stc-posiciones-row">
                                {MIDDLE_SUB_FIELDS.map((config) => (
                                    <ManualField
                                        key={config.key}
                                        config={config}
                                        value={middleSub[config.key]}
                                        onChange={(value) => setMiddleSub((prev) => ({ ...prev, [config.key]: value }))}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="stc-posiciones-group stc-posiciones-right">
                        <div className="stc-posiciones-row">
                            <ManualField config={FALTAS_FIELD} value={faltas} onChange={setFaltas} />
                            <ManualField config={TAQUILLA_FIELD} value={taquilla} onChange={setTaquilla} />
                        </div>
                        <div className="stc-posiciones-row">
                            {RIGHT_SUB_FIELDS.map((config) => (
                                <ManualField
                                    key={config.key}
                                    config={config}
                                    value={rightSub[config.key]}
                                    onChange={(value) => setRightSub((prev) => ({ ...prev, [config.key]: value }))}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <div className="stc-posiciones-body">
                <div className="stc-posiciones-side">
                    <ManualField config={NVA_POSICION_FIELD} value={nvaPosicion} onChange={setNvaPosicion} />
                    <label className="stc-report-option">
                        <input type="radio" checked={verCambios} onChange={() => setVerCambios(true)} />
                        Ver Cambios
                    </label>
                </div>
                <DataTable title="" className="stc-table-posiciones" rowHeader columns={COLUMNS} rows={rows} />
            </div>
        </CatalogoLayout>
    );
}
