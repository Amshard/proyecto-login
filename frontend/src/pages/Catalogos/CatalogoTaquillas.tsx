import { useMemo } from 'react';
import {
    createTaquilla,
    deleteTaquilla,
    getEstaciones,
    getLineas,
    getTaquillas,
    getTaquillasOperacion,
    type Linea,
    type Taquilla,
    type TaquillaOperacion,
    updateTaquilla,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { openPdf, type PdfSection } from '../../utils/pdf';
import {
    catalogoActions,
    CODE_CHARS,
    codeField,
    isCodePrefix,
    lineaName,
    padCode,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from './useCatalogo';

type TaquillaForm = Record<
    'id_taquilla' | 'turno' | 'dirdelinea' | 'extension_tel' | 'id_linea' | 'id_estacion',
    string
>;

const EMPTY_FORM: TaquillaForm = {
    id_taquilla: '',
    turno: '',
    dirdelinea: '',
    extension_tel: '',
    id_linea: '',
    id_estacion: '',
};

const KEY_FIELDS: (keyof TaquillaForm)[] = ['id_linea', 'id_estacion', 'id_taquilla', 'turno'];
const REQUIRED = (Object.keys(EMPTY_FORM) as (keyof TaquillaForm)[]).filter((key) => key !== 'extension_tel');

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_estacion', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_taquilla', 'Taquilla', 1, { width: 60, wrap: 80, numeric: true }), isKey: true },
    { ...codeField('turno', 'Turno', 1, { numeric: true }), isKey: true },
    codeField('dirdelinea', 'Dir. Línea', 1, { width: 60, wrap: 90, numeric: true, allowedChars: '012' }),
    { ...textField('nombre_direccion', 'Dirección', 150, { wrap: 170 }), readOnly: true },
    textField('extension_tel', 'Extensión', 110, { maxLength: 10, wrap: 130 }),
];

const taquillaCode = (linea: string, estacion: string, digit: string) =>
    padCode(linea) + padCode(estacion) + digit.slice(-1);

const direccionName = (linea: Linea | undefined, dir: number) => {
    if (linea && dir === linea.dirdelinea1) return linea.nombre_dirlin1;
    if (linea && dir === linea.dirdelinea2) return linea.nombre_dirlin2;
    return '';
};

const formToTaquilla = (form: TaquillaForm, previous?: Taquilla): Taquilla => ({
    ...previous,
    ...form,
    id_linea: padCode(form.id_linea),
    id_estacion: padCode(form.id_estacion),
    id_taquilla: taquillaCode(form.id_linea, form.id_estacion, form.id_taquilla),
    dirdelinea: Number(form.dirdelinea) || 0,
    extension_tel: form.extension_tel || null,
});

const codeOptions = (codes: string[]) =>
    [...new Set(codes)].sort((a, b) => Number(a) - Number(b)).map((value) => ({ value, label: '' }));

const countTaquillas = (rows: Taquilla[]) => new Set(rows.map((r) => r.id_taquilla)).size;

const OPERACION_PDF = {
    title: 'CATÁLOGO DE TAQUILLAS EN OPERACIÓN (ULTIMO ROL)',
    footerTitle: 'RptCatTaquillas',
    columns: [
        { header: 'Taquilla', cell: (r) => r.id_taquilla },
        { header: 'Turno', cell: (r) => r.turno, center: true },
        { header: 'Línea', cell: (r) => r.linea, center: true },
        { header: 'Nombre de la estación', cell: (r) => r.nombre_estacion },
    ] as Column<TaquillaOperacion>[],
    showCount: false,
};

const HEADING_GAP = ' '.repeat(5);
const DIRECCION_GAP = ' '.repeat(10);
const COUNT_GAP = ' '.repeat(4);
const heading = (...parts: string[]) => parts.filter(Boolean).join(HEADING_GAP);
const porTaquilla = (r: Taquilla) => r.id_taquilla;

const REPORT_PDF = {
    title: 'CATÁLOGO DE TAQUILLAS Y TURNOS',
    footerTitle: 'RptCatTaquillas',
    fontSize: 9,
    rowPadding: 2,
    rowsAlignWith: `ESTACIÓN 00${HEADING_GAP}`,
    countLabel: 'Taquillas',
    keepTogether: true,
    countText: (rows: Taquilla[]) => `Total de${COUNT_GAP}${countTaquillas(rows)}${COUNT_GAP}Taquillas en la red`,
    countBold: true,
    countUnderline: true,
    countRule: true,
    countSplitNumber: true,
};

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
    const [lineas] = useCatalogoRows(getLineas);
    const [estaciones] = useCatalogoRows(getEstaciones);
    const [enOperacion] = useCatalogoRows(getTaquillasOperacion);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { required: REQUIRED, fields: FIELDS });
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToTaquilla, {
        create: createTaquilla,
        update: updateTaquilla,
        remove: (r) => deleteTaquilla(r.id_taquilla, r.turno),
        describe: (r) => `Taquilla ${r.id_taquilla} turno ${r.turno}`,
        savedNote: (r) => (r.extension_tel?.trim() ? undefined : 'Taquilla guardada sin extensión, posteriormente podrá asignarla.'),
    });

    const idLinea = padCode(form.id_linea);
    const idEstacion = padCode(form.id_estacion);
    const prefix = idLinea && idEstacion ? idLinea + idEstacion : '';
    const idTaquilla = prefix && form.id_taquilla ? prefix + form.id_taquilla.slice(-1) : '';
    const linea = lineas.find((l) => l.id_linea === idLinea);
    const nombreEstacion =
        estaciones.find((e) => e.id_linea === idLinea && e.id_estacion === idEstacion)?.nombre_estacion ?? '';

    const { columns, pdf } = useMemo(() => {
        const porId = new Map(lineas.map((l) => [l.id_linea, l]));
        const nombresEstacion = new Map(estaciones.map((e) => [`${e.id_linea}|${e.id_estacion}`, e.nombre_estacion]));
        const nombreLinea = (r: Taquilla) => lineaName(porId.get(r.id_linea));
        const estacionDe = (r: Taquilla) => nombresEstacion.get(`${r.id_linea}|${r.id_estacion}`) ?? '';
        const sections: PdfSection<Taquilla>[] = [
            {
                key: (r) => r.id_linea,
                label: (r) => heading(`LÍNEA ${r.id_linea}`, nombreLinea(r)),
                total: (rs) => `${countTaquillas(rs)} Taquillas en la Línea ${rs[0].id_linea} ${nombreLinea(rs[0])}`.trim(),
                pageBreak: true,
            },
            {
                key: (r) => r.id_estacion,
                label: (r) => heading(`ESTACIÓN ${r.id_estacion}`, estacionDe(r)),
                total: (rs) => `${countTaquillas(rs)} Taquillas en la Estación ${rs[0].id_estacion} ${estacionDe(rs[0])}`.trim(),
            },
        ];
        const reportColumns: Column<Taquilla>[] = [
            { header: 'Taquilla', cell: (r) => r.id_taquilla, repeatKey: porTaquilla, indent: 28 },
            { header: 'Turno', cell: (r) => r.turno, center: true },
            { header: 'Ext_Tel', cell: (r) => r.extension_tel },
            {
                header: 'Dirección de Línea',
                cell: (r) => {
                    const l = porId.get(r.id_linea);
                    const nombres = [l?.nombre_dirlin1, l?.nombre_dirlin2].filter((part) => part != null).join(DIRECCION_GAP);
                    return heading(String(r.dirdelinea), nombres);
                },
                repeatKey: porTaquilla,
                indent: 30,
            },
        ];
        return {
            columns: [
                { header: 'Taquilla', cell: (r) => r.id_taquilla },
                { header: 'Estación', cell: (r) => r.id_estacion },
                { header: 'Turno', cell: (r) => r.turno },
                { header: 'DirLin', cell: (r) => r.dirdelinea },
                {
                    header: 'Dirección',
                    cell: (r) => direccionName(porId.get(r.id_linea), r.dirdelinea) || 'SIN DIRECCION DE LINEA',
                },
                { header: 'Ext_Tel', cell: (r) => r.extension_tel },
                { header: 'Línea', cell: (r) => r.id_linea },
            ] as Column<Taquilla>[],
            pdf: { ...REPORT_PDF, columns: reportColumns, sections, rows: rows.filter((r) => r.id_linea !== '00') },
        };
    }, [lineas, estaciones, rows]);

    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({ value: l.id_linea, label: lineaName(l) }));
        const estacionOptions = estaciones
            .filter((e) => e.id_linea === idLinea)
            .map((e) => ({ value: e.id_estacion, label: e.nombre_estacion }));
        const taquillas = prefix ? rows.filter((r) => r.id_taquilla.length === prefix.length + 1 && r.id_taquilla.startsWith(prefix)) : [];
        const turnos = idTaquilla ? rows.filter((r) => r.id_taquilla === idTaquilla) : rows;
        const accepting = (options: { value: string }[]) => {
            const codes = options.map((o) => o.value);
            return { options, accept: (v: string) => isCodePrefix(v, codes) };
        };
        const extra: Record<string, object> = {
            id_linea: accepting(lineaOptions),
            id_estacion: accepting(estacionOptions),
            id_taquilla: { options: codeOptions(taquillas.map((r) => r.id_taquilla.slice(-1))) },
            turno: { options: codeOptions(turnos.map((r) => r.turno)) },
        };
        return FIELDS.map((field) => ({ ...field, ...extra[field.key] }));
    }, [lineas, estaciones, rows, idLinea, prefix, idTaquilla]);

    const taquillaChange = keyChange(KEY_FIELDS, (f) =>
        f.id_taquilla && f.turno
            ? rows.find((r) => r.id_taquilla === taquillaCode(f.id_linea, f.id_estacion, f.id_taquilla) && r.turno === f.turno)
            : undefined
    );

    const onFieldChange = (key: string, value: string) => {
        const lineaChanged = key === 'id_linea' && padCode(value.toUpperCase()) !== idLinea;
        taquillaChange(key as keyof TaquillaForm, value, lineaChanged ? { id_estacion: '' } : undefined);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Taquillas y sus Turnos"
            statusLabel="Catálogo de Taquillas"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            reportActions={
                <button
                    type="button"
                    className="stc-btn stc-generar-reporte-btn"
                    onClick={() => openPdf({ ...OPERACION_PDF, rows: enOperacion })}
                >
                    Reporte Taquillas en Operacion
                </button>
            }
            reportLabel="Reporte Taquillas y turnos"
            fields={
                <ManualFields
                    fields={fields}
                    form={{
                        ...form,
                        id_taquilla: form.id_taquilla.slice(-1),
                        nombre_linea: lineaName(linea),
                        nombre_estacion: nombreEstacion,
                        nombre_direccion: form.dirdelinea ? direccionName(linea, Number(form.dirdelinea)) : '',
                    }}
                    onChange={onFieldChange}
                />
            }
            pdf={pdf}
        >
            <DataTable
                title="Taquillas de la red"
                className="stc-table-taquillas"
                columns={columns}
                rows={rows}
                onRowSelect={fill}
                activeRow={selected as Taquilla | null}
            />
        </CatalogoLayout>
    );
}
