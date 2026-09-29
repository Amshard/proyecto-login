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
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from './useCatalogo';

interface LineaConPermanencia extends Linea {
    nombre_perma: string | null;
    descripcion: string | null;
}

type LineaForm = Record<keyof LineaConPermanencia, string>;

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
    nombre_perma: '',
    descripcion: '',
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

const COLUMNS: Column<LineaConPermanencia>[] = [
    { header: 'Línea', cell: (r) => r.id_linea },
    { header: 'Dirección', cell: (r) => r.dirdelinea1 },
    { header: 'Estación Inicial', cell: (r) => r.nombre_dirlin1 },
    { header: 'Dirección', cell: (r) => r.dirdelinea2 },
    { header: 'Estación Terminal', cell: (r) => r.nombre_dirlin2 },
    { header: 'Estaciones', cell: (r) => r.estaciones },
    { header: 'Taquillas', cell: (r) => r.taquillas },
    { header: 'Tramos', cell: (r) => r.tramos },
    { header: 'Permanencia', cell: (r) => r.id_permanencia },
    { header: 'Nombre', cell: (r) => r.nombre_perma },
    { header: 'Descripcion', cell: (r) => r.descripcion },
];

const joinParts = (separator: string, ...parts: (string | null)[]) =>
    parts.filter((part) => part).join(separator);

const PDF_COLUMNS: Column<LineaConPermanencia>[] = [
    { header: 'Línea', cell: (r) => r.id_linea, center: true },
    { header: 'Nombre', cell: (r) => joinParts(' - ', r.nombre_dirlin1, r.nombre_dirlin2) },
    { header: 'Estaciones', cell: (r) => r.estaciones, total: true, center: true },
    { header: 'Taquillas', cell: (r) => r.taquillas, total: true, center: true },
    { header: 'Tramos', cell: (r) => r.tramos, center: true },
    { header: 'Permanencia', cell: (r) => joinParts('         ', r.id_permanencia, r.nombre_perma) },
];

const toNumberOrNull = (value: string) => (value ? Number(value) : null);

const formToLinea = (form: LineaForm): LineaConPermanencia => ({
    id_linea: form.id_linea,
    dirdelinea1: Number(DIR_INI),
    nombre_dirlin1: form.nombre_dirlin1,
    dirdelinea2: Number(DIR_FIN),
    nombre_dirlin2: form.nombre_dirlin2,
    estaciones: toNumberOrNull(form.estaciones),
    taquillas: toNumberOrNull(form.taquillas),
    tramos: toNumberOrNull(form.tramos),
    id_permanencia: form.id_permanencia || null,
    nombre_perma: form.nombre_perma || null,
    descripcion: form.descripcion || null,
});

async function loadLineas(): Promise<LineaConPermanencia[]> {
    const [lineas, permanencias] = await Promise.all([getLineas(), getPermanencias()]);
    const porId = new Map(permanencias.map((p) => [p.id_permanencia, p]));
    return lineas.map((linea) => {
        const permanencia = linea.id_permanencia ? porId.get(linea.id_permanencia) : undefined;
        return {
            ...linea,
            nombre_perma: permanencia?.nombre_perma ?? null,
            descripcion: permanencia?.descripcion ?? null,
        };
    });
}

export default function CatalogoLineas() {
    const [rows, setRows] = useCatalogoRows(loadLineas);
    const [permanencias] = useCatalogoRows(getPermanencias);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { required: REQUIRED });
    const { form, selected, updateField, clear, fill } = catalogoForm;

    const fields = useMemo(() => {
        const options = permanencias.map((p) => ({ value: p.id_permanencia, label: p.nombre_perma }));
        const allowedChars = permanencias.map((p) => p.id_permanencia).join('');
        const lineaCodes = rows.map((r) => r.id_linea);
        const withOptions = FIELDS.map((field) => {
            if (field.key === 'id_linea') return { ...field, accept: (v: string) => isCodePrefix(v, lineaCodes) };
            if (field.key === 'id_permanencia') return { ...field, options, allowedChars };
            return field;
        });
        const permaFields = form.id_permanencia
            ? PERMA_FIELDS
            : PERMA_FIELDS.map((field) => ({ ...field, wrapStyle: { ...field.wrapStyle, visibility: 'hidden' as const } }));
        return [...withOptions, ...permaFields];
    }, [rows, permanencias, form.id_permanencia]);

    const onFieldChange = (key: keyof LineaForm, rawValue: string) => {
        const value = key === 'id_linea' ? rawValue.toUpperCase() : rawValue;
        updateField(key, value);
        if (key !== 'id_permanencia') return;
        const permanencia = permanencias.find((p) => p.id_permanencia === value);
        updateField('nombre_perma', permanencia?.nombre_perma ?? '');
        updateField('descripcion', permanencia?.descripcion ?? '');
    };

    const validate = () => {
        if (!catalogoForm.validate()) return false;
        const id = form.id_permanencia.trim();
        if (id && !permanencias.some((p) => p.id_permanencia === id)) {
            window.alert(`La permanencia "${id}" no existe en el catálogo de permanencias.`);
            return false;
        }
        return true;
    };

    const { onSave, onModify, onDelete } = catalogoActions(setRows, { ...catalogoForm, validate }, formToLinea, {
        create: createLinea,
        update: updateLinea,
        remove: (r) => deleteLinea(r.id_linea),
        describe: (r) => `Línea ${r.id_linea}`,
    });

    const sortedRows = useMemo(
        // Plain character order puts digits before letters: 09 < 0A < 0B < 12.
        () => [...rows].sort((a, b) => (a.id_linea < b.id_linea ? -1 : a.id_linea > b.id_linea ? 1 : 0)),
        [rows],
    );

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Líneas"
            statusLabel="Catálogo de Líneas"
            count={rows.length}
            onClear={clear}
            onSave={onSave}
            onModify={onModify}
            onDelete={onDelete}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={fields}
                    form={{ ...form, dirdelinea1: DIR_INI, dirdelinea2: DIR_FIN }}
                    onChange={onFieldChange}
                    lockKeys={selected !== null}
                />
            }
            pdfTitle="CATALOGO DE LÍNEAS"
            pdfColumns={PDF_COLUMNS}
            pdfRows={sortedRows}
            pdfCountLabel="Líneas"
            pdfCountTitle="Total de Líneas"
            pdfCountBold
            pdfCountUnderline
            pdfCountUnderlineSplit
            pdfRowPadding={7}
        >
            <DataTable
                title="Líneas de la red"
                className="stc-table-lineas"
                columns={COLUMNS}
                rows={sortedRows}
                onRowSelect={fill}
            />
        </CatalogoLayout>
    );
}
