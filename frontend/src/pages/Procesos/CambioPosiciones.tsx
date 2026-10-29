import { useMemo, useState } from 'react';
import { getLineas } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import { CODE_CHARS, codeField, isCodePrefix, lineaName, padCode, textField, useCatalogoRows } from '../Catalogos/useCatalogo';
import { RadioOption, RadioOptions, SideButtons } from './ProcesoControls';
import { NO_ROWS, fixedField, headersOnly, useForm } from './procesoFields';
import './Procesos.css';

const FIVE_CHARS = 60;

const EXPEDIENTE_FIELD = fixedField(codeField('expediente', 'Expediente', 5, { width: FIVE_CHARS, numeric: true }));
const POSICION_FIELD = fixedField(codeField('posicion', 'Posicion', 5, { width: FIVE_CHARS, numeric: true }));
const TRAMO_FIELD = fixedField(codeField('tramo', 'Tramo', 5, { width: FIVE_CHARS }));
const DETALLE = textField('detalle', 'ㅤ', 800, { maxLength: 50 });
const DETALLE_FIELD = { ...DETALLE, wrapStyle: {}, inputStyle: { ...DETALLE.inputStyle, height: 30, width: 425 } };
const MIDDLE_SUB_FIELDS = [
    fixedField(codeField('categoria', 'Categoría', 5, { width: FIVE_CHARS })),
    fixedField(codeField('descansos', 'Descansos', 5, { width: FIVE_CHARS })),
    fixedField(codeField('lugar', 'Lugar', 2, { width: 20, numeric: true })),
    fixedField(codeField('calificacion', 'Calificacion', 5, { width: FIVE_CHARS, allowedChars: '0123456789.' })),
];

const FALTAS_FIELD = fixedField(codeField('faltas', 'Faltas', 2, { width: 50, numeric: true }));
const TAQUILLA_FIELD = fixedField(codeField('taquilla', 'Taquilla', 5, { width: FIVE_CHARS, numeric: true }));
const RIGHT_SUB_FIELDS = [
    fixedField(codeField('turno', 'Turno', 1, { width: 30 })),
    fixedField(codeField('perm', 'Perm.', 1, { width: 30 })),
    fixedField(codeField('jubdo', 'Jubdo', 1, { width: 30 })),
];

const NVA_POSICION_FIELD = fixedField(codeField('nva_posicion', 'Nva Posicion', 5, { width: 90, numeric: true }));

const FIELDS = [
    EXPEDIENTE_FIELD,
    POSICION_FIELD,
    TRAMO_FIELD,
    DETALLE_FIELD,
    ...MIDDLE_SUB_FIELDS,
    FALTAS_FIELD,
    TAQUILLA_FIELD,
    ...RIGHT_SUB_FIELDS,
    NVA_POSICION_FIELD,
];
type FieldKey = (typeof FIELDS)[number]['key'];

const COLUMNS = headersOnly(['Reg', 'Nva P', 'Exp', 'Tramo', 'Fat', 'Tquilla', 'Catg', 'Des', 'Lg', 'Calif', 'Tu', 'Pem', 'P Ant']);

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
const TRAMOS_LINEA_FIELD = {
    ...codeField('linea', '', 2, { width: 60, padTo: 2, allowedChars: CODE_CHARS }),
    optionsButton: true,
};
const [POR_LINEA, TODAS_LAS_LINEAS] = ['Por Línea', 'Todas las Líneas'];
const TRAMOS_CLASIFICACION = 'Clasificada por: Permanencia, Tramo, Turno y lugar';

const SIN_LUGAR_COLUMNS = headersOnly(['Reg', 'Exp', 'Nombre', 'Fecha Ing', 'Jub', 'FoM']);
const SIN_LUGAR_OPCIONES = ['Por Expediente', 'Por Alfabético'];

export default function CambioPosiciones() {
    const [form, setField, resetForm] = useForm(FIELDS);
    const [verCambios, setVerCambios] = useState(false);
    const [tramosOpcion, setTramosOpcion] = useState('');
    const [tramosLinea, setTramosLinea] = useState('');
    const [sinLugarOpcion, setSinLugarOpcion] = useState('');
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
        tramosOpcion === TODAS_LAS_LINEAS
            ? `EN TODO EL ROL ${TRAMOS_CLASIFICACION}`
            : tramosOpcion === POR_LINEA && lineaElegida
              ? `${lineaName(lineaElegida)} ${TRAMOS_CLASIFICACION}`
              : '';

    const elegirTramos = (opcion: string) => {
        setTramosOpcion(opcion);
        if (opcion !== POR_LINEA) setTramosLinea('');
    };

    const limpiar = () => {
        resetForm();
        setVerCambios(false);
        setTramosOpcion('');
        setTramosLinea('');
        setSinLugarOpcion('');
    };

    const field = (config: ManualFieldConfig<FieldKey>) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={(value) => setField(config.key, value)} />
    );

    return (
        <CatalogoLayout
            tabLabel="Cambio de Lugares"
            statusLabel="Realizados Antes y Despues de Cambios"
            actionsOnAllTabs
            actions={
                <SideButtons
                    step={55}
                    buttons={[
                        { label: 'Limpiar', onClick: limpiar },
                        { label: 'Guarda Los Cbios' },
                        { label: 'Regresa Cbios' },
                        { label: 'Ver Reporte' },
                    ]}
                />
            }
            extraTabs={[
                {
                    label: 'Tramos sin Expediente',
                    content: (
                        <DataTable
                            title=""
                            className="stc-table-fit"
                            rowHeader={TRAMOS_HEADER_COLS}
                            columns={TRAMOS_COLUMNS}
                            rows={NO_ROWS}
                            header={
                                <div className="stc-tramos-panel">
                                    <div className="stc-tramos-opciones">
                                        <RadioOption label={POR_LINEA} checked={tramosOpcion === POR_LINEA} onCheck={() => elegirTramos(POR_LINEA)} />
                                        <ManualField
                                            config={tramosLineaField}
                                            value={tramosLinea}
                                            onChange={setTramosLinea}
                                            readOnly={tramosOpcion !== POR_LINEA}
                                        />
                                        <RadioOption
                                            label={TODAS_LAS_LINEAS}
                                            checked={tramosOpcion === TODAS_LAS_LINEAS}
                                            onCheck={() => elegirTramos(TODAS_LAS_LINEAS)}
                                        />
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
                            className="stc-table-fit"
                            rowHeader
                            columns={SIN_LUGAR_COLUMNS}
                            rows={NO_ROWS}
                            header={
                                <div className="stc-tramos-panel">
                                    <div className="stc-tramos-opciones">
                                        <RadioOptions options={SIN_LUGAR_OPCIONES} value={sinLugarOpcion} onChange={setSinLugarOpcion} />
                                    </div>
                                </div>
                            }
                        />
                    ),
                },
            ]}
            fields={
                <div className="stc-manual-fields stc-posiciones-fields">
                    {field(EXPEDIENTE_FIELD)}
                    <div className="stc-posiciones-row stc-posiciones-middle">
                        {field(POSICION_FIELD)}
                        {field(TRAMO_FIELD)}
                        <div className="stc-posiciones-group">
                            {field(DETALLE_FIELD)}
                            <div className="stc-posiciones-row">{MIDDLE_SUB_FIELDS.map(field)}</div>
                        </div>
                    </div>
                    <div className="stc-posiciones-group">
                        <div className="stc-posiciones-row">
                            {field(FALTAS_FIELD)}
                            {field(TAQUILLA_FIELD)}
                        </div>
                        <div className="stc-posiciones-row">{RIGHT_SUB_FIELDS.map(field)}</div>
                    </div>
                </div>
            }
        >
            <div className="stc-posiciones-body">
                <div className="stc-posiciones-side">
                    {field(NVA_POSICION_FIELD)}
                    <RadioOption label="Ver Cambios" checked={verCambios} onCheck={() => setVerCambios(true)} />
                </div>
                <DataTable title="" className="stc-table-fit" rowHeader columns={COLUMNS} rows={NO_ROWS} />
            </div>
        </CatalogoLayout>
    );
}
