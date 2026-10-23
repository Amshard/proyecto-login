import { useMemo } from 'react';
import { createLinea, deleteLinea, getLineas, getPermanencias, type Linea, updateLinea } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import {
    catalogoActions,
    CODE_CHARS,
    codeField,
    isCodePrefix,
    padCode,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from './useCatalogo';

type LineaForm = Record<keyof Linea, string>;

const DIR_INI = '1';
const DIR_FIN = '2';

const EMPTY_FORM: LineaForm = {
    id_linea: '',
    dirdelinea1: DIR_INI,
    nombre_dirlin1: '',
    dirdelinea2: DIR_FIN,
    nombre_dirlin2: '',
    estaciones: '',
    taquillas: '',
    tramos: '',
    id_permanencia: '',
};

const COUNT = { width: 60, wrap: 80, numeric: true, nonZero: true };

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...codeField('dirdelinea1', 'DirIni', 5, { width: 50, wrap: 70, numeric: true }), readOnly: true },
    textField('nombre_dirlin1', 'Nombre Dirdelinea1', 150, { maxLength: 20 }),
    { ...codeField('dirdelinea2', 'DirFin', 5, { width: 50, wrap: 70, numeric: true }), readOnly: true },
    { ...textField('nombre_dirlin2', 'Nombre Dirdelinea2', 150, { maxLength: 20 }), breakAfter: true },
    codeField('estaciones', 'Estaciones', 5, COUNT),
    codeField('taquillas', 'Taquillas', 5, COUNT),
    codeField('tramos', 'Tramos', 5, { ...COUNT, wrap: 70 }),
    codeField('id_permanencia', 'Permanencia', 1, { width: 45, wrap: 80, numeric: true }),
];

const REQUIRED = FIELDS.map((field) => field.key);

const PERMA_FIELDS = [
    { ...textField('nombre_perma', 'Nombre Permanencia', 150), readOnly: true },
    { ...textField('descripcion', 'Descripción', 250), readOnly: true },
];
const HIDDEN_PERMA_FIELDS = PERMA_FIELDS.map((field) => ({
    ...field,
    wrapStyle: { ...field.wrapStyle, visibility: 'hidden' as const },
}));

const PDF = {
    title: 'CATALOGO DE LÍNEAS',
    footerTitle: 'RptCatLineas',
    countLabel: 'Líneas',
    countTitle: 'Total de Líneas',
    countBold: true,
    countUnderline: true,
    countUnderlineSplit: true,
    rowPadding: 7,
};

const joinParts = (separator: string, ...parts: (string | null | undefined)[]) => parts.filter(Boolean).join(separator);
const toNumberOrNull = (value: string) => (value ? Number(value) : null);

const formToLinea = (form: LineaForm): Linea => ({
    id_linea: form.id_linea,
    dirdelinea1: Number(DIR_INI),
    nombre_dirlin1: form.nombre_dirlin1,
    dirdelinea2: Number(DIR_FIN),
    nombre_dirlin2: form.nombre_dirlin2,
    estaciones: toNumberOrNull(form.estaciones),
    taquillas: toNumberOrNull(form.taquillas),
    tramos: toNumberOrNull(form.tramos),
    id_permanencia: form.id_permanencia || null,
});

export default function CatalogoLineas() {
    const [rows, setRows] = useCatalogoRows(getLineas);
    const [permanencias] = useCatalogoRows(getPermanencias);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: REQUIRED,
        fields: FIELDS,
        checks: {
            id_permanencia: (v) =>
                permanencias.some((p) => p.id_permanencia === v)
                    ? undefined
                    : `La permanencia "${v}" no existe en el catálogo de permanencias.`,
        },
    });
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToLinea, {
        create: createLinea,
        update: updateLinea,
        remove: (r) => deleteLinea(r.id_linea),
        describe: (r) => `Línea ${r.id_linea}`,
    });

    const { permanencia, columns, pdfColumns } = useMemo(() => {
        const porId = new Map(permanencias.map((p) => [p.id_permanencia, p]));
        const permanencia = (id: string | null) => (id ? porId.get(id) : undefined);
        const nombrePerma = (r: Linea) => permanencia(r.id_permanencia)?.nombre_perma;
        return {
            permanencia,
            columns: [
                { header: 'Línea', cell: (r) => r.id_linea },
                { header: 'Dirección', cell: (r) => r.dirdelinea1 },
                { header: 'Estación Inicial', cell: (r) => r.nombre_dirlin1 },
                { header: 'Dirección', cell: (r) => r.dirdelinea2 },
                { header: 'Estación Terminal', cell: (r) => r.nombre_dirlin2 },
                { header: 'Estaciones', cell: (r) => r.estaciones },
                { header: 'Taquillas', cell: (r) => r.taquillas },
                { header: 'Tramos', cell: (r) => r.tramos },
                { header: 'Permanencia', cell: (r) => r.id_permanencia },
                { header: 'Nombre', cell: nombrePerma },
                { header: 'Descripcion', cell: (r) => permanencia(r.id_permanencia)?.descripcion },
            ] as Column<Linea>[],
            pdfColumns: [
                { header: 'Línea', cell: (r) => r.id_linea, center: true },
                { header: 'Nombre', cell: (r) => joinParts(' - ', r.nombre_dirlin1, r.nombre_dirlin2) },
                { header: 'Estaciones', cell: (r) => r.estaciones, total: true, center: true },
                { header: 'Taquillas', cell: (r) => r.taquillas, total: true, center: true },
                { header: 'Tramos', cell: (r) => r.tramos, center: true },
                { header: 'Permanencia', cell: (r) => joinParts(' '.repeat(9), r.id_permanencia, nombrePerma(r)) },
            ] as Column<Linea>[],
        };
    }, [permanencias]);

    const fields = useMemo(() => {
        const lineaCodes = rows.map((r) => r.id_linea);
        const extra: Record<string, object> = {
            id_linea: { accept: (v: string) => isCodePrefix(v, lineaCodes) },
            id_permanencia: {
                options: permanencias.map((p) => ({ value: p.id_permanencia, label: p.nombre_perma })),
                allowedChars: permanencias.map((p) => p.id_permanencia).join(''),
            },
        };
        return [
            ...FIELDS.map((field) => ({ ...field, ...extra[field.key] })),
            ...(form.id_permanencia ? PERMA_FIELDS : HIDDEN_PERMA_FIELDS),
        ];
    }, [rows, permanencias, form.id_permanencia]);

    const sortedRows = useMemo(
        () => [...rows].sort((a, b) => (a.id_linea < b.id_linea ? -1 : a.id_linea > b.id_linea ? 1 : 0)),
        [rows]
    );

    const lineaChange = keyChange(['id_linea'], (f) => rows.find((r) => r.id_linea === padCode(f.id_linea)));
    const formPerma = permanencia(form.id_permanencia);

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Líneas"
            statusLabel="Catálogo de Líneas"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={fields}
                    form={{
                        ...form,
                        dirdelinea1: DIR_INI,
                        dirdelinea2: DIR_FIN,
                        nombre_perma: formPerma?.nombre_perma ?? '',
                        descripcion: formPerma?.descripcion ?? '',
                    }}
                    onChange={(key: string, value) => lineaChange(key as keyof LineaForm, value)}
                />
            }
            pdf={{ ...PDF, columns: pdfColumns, rows: sortedRows }}
        >
            <DataTable
                title="Líneas de la red"
                className="stc-table-lineas"
                columns={columns}
                rows={sortedRows}
                onRowSelect={fill}
                activeRow={selected as Linea | null}
            />
        </CatalogoLayout>
    );
}
