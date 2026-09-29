import { useMemo } from 'react';
import {
    createTaquilla,
    deleteTaquilla,
    getEstaciones,
    getLineas,
    getTaquillas,
    type Taquilla,
    updateTaquilla,
} from '../../api/catalogos';
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

// A taquilla code is Línea + Estación + one digit (01023); the Taquilla box only holds that last digit,
// so Línea and Estación are part of the key too.
const taquillaCode = (linea: string, estacion: string, digit: string) =>
    padCode(linea) + padCode(estacion) + digit.slice(-1);

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_estacion', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_taquilla', 'Taquilla', 1, { width: 60, wrap: 80, numeric: true }), isKey: true },
    { ...codeField('turno', 'Turno', 1, { numeric: true }), isKey: true },
    codeField('dirdelinea', 'Dir. Línea', 1, { width: 60, wrap: 90, numeric: true, allowedChars: '12' }),
    textField('extension_tel', 'Extensión', 110, { maxLength: 10, wrap: 130 }),
];

// Extensión is optional: a new taquilla may not have its phone line yet.
const REQUIRED = (Object.keys(EMPTY_FORM) as (keyof TaquillaForm)[]).filter((key) => key !== 'extension_tel');

const COLUMNS: Column<Taquilla>[] = [
    { header: 'Taquilla', cell: (r) => r.id_taquilla },
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Turno', cell: (r) => r.turno },
    { header: 'DirLin', cell: (r) => r.dirdelinea },
    { header: 'Dirección', cell: (r) => (r.direccion?.trim() ? r.direccion : 'SIN DIRECCION DE LINEA') },
    { header: 'ExtTel', cell: (r) => r.extension_tel },
    { header: 'Línea', cell: (r) => r.id_linea },
];

const formToTaquilla = (form: TaquillaForm, previous?: Taquilla): Taquilla => ({
    ...previous,
    ...form,
    id_linea: padCode(form.id_linea),
    id_estacion: padCode(form.id_estacion),
    id_taquilla: taquillaCode(form.id_linea, form.id_estacion, form.id_taquilla),
    dirdelinea: Number(form.dirdelinea) || 0,
    extension_tel: form.extension_tel || null,
});

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
    const [lineas] = useCatalogoRows(getLineas);
    const [estaciones] = useCatalogoRows(getEstaciones);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { required: REQUIRED });
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const { onSave: saveTaquilla, onModify, onDelete } = catalogoActions(
        setRows,
        catalogoForm,
        formToTaquilla,
        {
            create: createTaquilla,
            update: updateTaquilla,
            remove: (r) => deleteTaquilla(r.id_taquilla, r.turno),
        },
    );

    const onSave = async () => {
        const saved = await saveTaquilla();
        if (saved && !form.extension_tel.trim()) {
            window.alert('Taquilla guardada sin extensión, posteriormente podrá asignarla.');
        }
    };

    const nombreDeLinea = (id: string) => {
        const l = lineas.find((item) => item.id_linea === id);
        return l ? [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-') : '';
    };
    // Look up with the padded code so a single typed digit already matches (1 -> 01).
    const idLinea = padCode(form.id_linea);
    const idEstacion = padCode(form.id_estacion);
    const nombreEstacion =
        estaciones.find((e) => e.id_linea === idLinea && e.id_estacion === idEstacion)?.nombre_estacion ?? '';

    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({
            value: l.id_linea,
            label: [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-'),
        }));
        const estacionOptions = estaciones
            .filter((e) => e.id_linea === idLinea)
            .map((e) => ({ value: e.id_estacion, label: e.nombre_estacion }));
        const lineaCodes = lineaOptions.map((o) => o.value);
        const estacionCodes = estacionOptions.map((o) => o.value);
        return FIELDS.map((field) => {
            if (field.key === 'id_linea') {
                return { ...field, options: lineaOptions, accept: (v: string) => isCodePrefix(v, lineaCodes) };
            }
            if (field.key === 'id_estacion') {
                return { ...field, options: estacionOptions, accept: (v: string) => isCodePrefix(v, estacionCodes) };
            }
            return field;
        });
    }, [lineas, estaciones, idLinea]);

    const onFieldChange = (key: string, rawValue: string) => {
        const value = key === 'id_linea' || key === 'id_estacion' ? rawValue.toUpperCase() : rawValue;
        // A different line invalidates the chosen station (padding 1 -> 01 on blur is the same line).
        if (key === 'id_linea' && padCode(value) !== idLinea) updateField('id_estacion', '');
        updateField(key as keyof TaquillaForm, value);
        if (key !== 'id_taquilla' || !value || !form.id_linea || !form.id_estacion) return;
        // An existing taquilla loads its record (Turno, Dir. Línea, etc.) like a double-click;
        // the typed turno wins when the taquilla has several.
        const id = taquillaCode(form.id_linea, form.id_estacion, value);
        const matches = rows.filter((r) => r.id_taquilla === id);
        const match = matches.find((r) => r.turno === form.turno) ?? matches[0];
        if (match) fill(match);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Taquillas y sus Turnos"
            statusLabel="Catálogo de Taquillas"
            count={rows.length}
            onClear={clear}
            onSave={onSave}
            onModify={onModify}
            onDelete={onDelete}
            editing={selected !== null}
            reportButton="Reporte Taquillas en Operaciones"
            fields={
                <ManualFields
                    fields={fields}
                    form={{
                        ...form,
                        // A loaded record holds the full code; the box shows only its last digit.
                        id_taquilla: form.id_taquilla.slice(-1),
                        nombre_linea: nombreDeLinea(idLinea),
                        nombre_estacion: nombreEstacion,
                    }}
                    onChange={onFieldChange}
                    lockKeys={selected !== null}
                />
            }
            pdfTitle="Catálogo de Taquillas"
            pdfColumns={COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Taquillas"
        >
            <DataTable
                title="Taquillas de la red"
                className="stc-table-taquillas"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
            />
        </CatalogoLayout>
    );
}
