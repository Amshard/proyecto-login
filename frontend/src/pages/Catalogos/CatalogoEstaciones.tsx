import { useMemo } from 'react';
import { createEstacion, deleteEstacion, type Estacion, getEstaciones, getLineas, updateEstacion } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import type { PdfGroup } from '../../utils/pdf';
import { catalogoActions, codeField, lineaName, padCode, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2, { numeric: true, padTo: 2 }), isKey: true },
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

export default function CatalogoEstaciones() {
    const [rows, setRows] = useCatalogoRows(getEstaciones);
    const [lineas] = useCatalogoRows(getLineas);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, (f) => ({ ...f }), {
        create: createEstacion,
        update: updateEstacion,
        remove: (r) => deleteEstacion(r.id_linea, r.id_estacion),
    });

    const nombreDeLinea = (id: string) => lineaName(lineas.find((l) => l.id_linea === id));
    const idLinea = padCode(form.id_linea);

    const onFieldChange = (key: string, value: string) => {
        updateField(key as keyof EstacionForm, value);
        if (key !== 'id_estacion') return;
        const idEstacion = padCode(value);
        const estacion = rows.find((r) => r.id_linea === idLinea && r.id_estacion === idEstacion);
        updateField('nombre_estacion', estacion?.nombre_estacion ?? '');
    };

    const pdfGroup: PdfGroup<Estacion> = {
        key: (r) => r.id_linea,
        label: (id) => [`Línea ${id}`, nombreDeLinea(id)].filter(Boolean).join('     '),
        total: (id, count) => [`Total de ${count} Estaciones en la línea ${id}`, nombreDeLinea(id)].filter(Boolean).join(' '),
    };

    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({ value: l.id_linea, label: lineaName(l) }));
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
            {...actions}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={fields}
                    form={{ ...form, nombre_linea: nombreDeLinea(idLinea) }}
                    onChange={onFieldChange}
                    lockKeys={selected !== null}
                />
            }
            pdf={{
                title: 'CATÁLOGO DE ESTACIONES',
                columns: PDF_COLUMNS,
                rows: rows.filter((r) => r.id_linea !== '00'),
                countLabel: 'Estaciones',
                countTitle: 'Total de estaciones en la Red del Metro',
                countBold: true,
                group: pdfGroup,
                unofficialNotes: false,
            }}
        >
            <DataTable title="Estaciones" columns={COLUMNS} rows={rows} onRowSelect={fill} />
        </CatalogoLayout>
    );
}
