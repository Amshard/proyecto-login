import { useMemo } from 'react';
import { createEstacion, deleteEstacion, type Estacion, getEstaciones, getLineas, updateEstacion } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import type { PdfGroup } from '../../utils/pdf';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

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

const PDF_COLUMNS: Column<Estacion>[] = [
    { header: 'Estación', cell: (r) => r.id_estacion, indent: 40, fit: true },
    { header: 'Nombre', cell: (r) => r.nombre_estacion },
];

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
    const nombreLinea = linea ? [linea.nombre_dirlin1, linea.nombre_dirlin2].filter(Boolean).join('-') : '';

    const pdfRows = useMemo(() => rows.filter((r) => r.id_linea !== '00'), [rows]);

    const pdfGroup = useMemo<PdfGroup<Estacion>>(() => {
        const nombreDeLinea = (id: string) => {
            const l = lineas.find((item) => item.id_linea === id);
            return l ? [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-') : '';
        };
        return {
            key: (r) => r.id_linea,
            label: (id) => [`Línea ${id}`, nombreDeLinea(id)].filter(Boolean).join('     '),
            total: (id, count) =>
                [`Total de ${count} Estaciones en la línea ${id}`, nombreDeLinea(id)].filter(Boolean).join(' '),
        };
    }, [lineas]);

    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({
            value: l.id_linea,
            label: [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-'),
        }));
        const estacionesDeLinea = rows.filter((r) => r.id_linea === idLinea);
        const estacionOptions = estacionesDeLinea.map((r) => ({ value: r.id_estacion, label: r.nombre_estacion }));
        const maxEstacion = Math.max(0, ...estacionesDeLinea.map((r) => Number(r.id_estacion) || 0));
        return FIELDS.map((field) => {
            if (field.key === 'id_linea') return { ...field, options: lineaOptions };
            if (field.key === 'id_estacion') {
                return { ...field, options: estacionOptions, max: maxEstacion || undefined };
            }
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
                    onChange={(key, value) => updateField(key as keyof EstacionForm, value)}
                    lockKeys={selected !== null}
                />
            }
            pdfTitle="CATÁLOGO DE ESTACIONES"
            pdfColumns={PDF_COLUMNS}
            pdfRows={pdfRows}
            pdfCountLabel="Estaciones"
            pdfCountTitle="Total de estaciones en la Red del Metro"
            pdfCountBold
            pdfTitleBold
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
