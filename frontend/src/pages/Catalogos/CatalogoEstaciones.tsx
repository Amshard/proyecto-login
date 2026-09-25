import { useMemo } from 'react';
import { createEstacion, deleteEstacion, type Estacion, getEstaciones, getLineas, updateEstacion } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import type { PdfGroup } from '../../utils/pdf';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

// Row 1: the line and its terminal stations (read-only). Row 2: the station.
const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    codeField('id_estacion', 'Estación', 2, { numeric: true, padTo: 2 }),
    textField('nombre_estacion', 'Nombre', 280, { maxLength: 25 }),
];

const COLUMNS: Column<Estacion>[] = [
    { header: 'Línea', cell: (r) => r.id_linea },
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Nombre de Estación', cell: (r) => r.nombre_estacion },
];

// The PDF puts each line on its own page, headed by the line, so only the station columns remain.
const PDF_COLUMNS: Column<Estacion>[] = [
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Nombre', cell: (r) => r.nombre_estacion },
];

// Codes are stored zero-padded; the input only pads on blur.
const padCode = (value: string) => (value ? value.padStart(2, '0') : '');

export default function CatalogoEstaciones() {
    const [rows, setRows] = useCatalogoRows(getEstaciones);
    const [lineas] = useCatalogoRows(getLineas);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const { onSave, onModify, onDelete } = catalogoActions(
        setRows,
        catalogoForm,
        (f) => ({ ...f }),
        {
            create: createEstacion,
            update: updateEstacion,
            remove: (r) => deleteEstacion(r.id_linea, r.id_estacion),
        },
    );

    const idLinea = padCode(form.id_linea);
    const linea = lineas.find((l) => l.id_linea === idLinea);
    const nombreLinea = linea ? [linea.nombre_dirlin1, linea.nombre_dirlin2].filter(Boolean).join(' - ') : '';

    const pdfGroup = useMemo<PdfGroup<Estacion>>(() => {
        const nombreDeLinea = (id: string) => {
            const l = lineas.find((item) => item.id_linea === id);
            return l ? [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join(' - ') : '';
        };
        return {
            key: (r) => r.id_linea,
            label: (id) => [`Línea ${id}`, nombreDeLinea(id)].filter(Boolean).join('     '),
            total: (id, count) =>
                [`Total de ${count} Estaciones en la línea ${id}`, nombreDeLinea(id)].filter(Boolean).join(' '),
        };
    }, [lineas]);

    // Línea offers every line; Estación offers the stations already registered on the chosen line.
    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({
            value: l.id_linea,
            label: [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join(' - '),
        }));
        const estacionOptions = rows
            .filter((r) => r.id_linea === idLinea)
            .map((r) => ({ value: r.id_estacion, label: r.nombre_estacion }));
        return FIELDS.map((field) => {
            if (field.key === 'id_linea') return { ...field, options: lineaOptions };
            if (field.key === 'id_estacion') return { ...field, options: estacionOptions };
            return field;
        });
    }, [lineas, rows, idLinea]);

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Estaciones"
            statusLabel="Catálogo de Estaciones"
            count={rows.length}
            onClear={clear}
            onSave={onSave}
            onModify={onModify}
            onDelete={onDelete}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={fields}
                    form={{ ...form, nombre_linea: nombreLinea }}
                    // nombre_linea is read-only, so only form keys reach here.
                    onChange={(key, value) => updateField(key as keyof EstacionForm, value)}
                    lockKeys={selected !== null}
                />
            }
            pdfTitle="Catálogo de Estaciones"
            pdfColumns={PDF_COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Estaciones"
            pdfGroup={pdfGroup}
            pdfUnofficialNotes={false}
        >
            <DataTable
                title="Estaciones"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
                selectedRow={selected}
            />
        </CatalogoLayout>
    );
}
