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
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

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

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2), selectOnly: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2), selectOnly: true },
    { ...textField('nombre_estacion', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_taquilla', 'Taquilla', 5, { width: 60, wrap: 80, numeric: true }), isKey: true },
    codeField('turno', 'Turno', 1, { numeric: true }),
    codeField('dirdelinea', 'Dir. Línea', 5, { width: 60, wrap: 90, numeric: true }),
    textField('extension_tel', 'Extensión', 110, { maxLength: 10, wrap: 130 }),
];

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
    dirdelinea: Number(form.dirdelinea) || 0,
    extension_tel: form.extension_tel || null,
});

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
    const [lineas] = useCatalogoRows(getLineas);
    const [estaciones] = useCatalogoRows(getEstaciones);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const { onSave, onModify, onDelete } = catalogoActions(
        setRows,
        catalogoForm,
        formToTaquilla,
        {
            create: createTaquilla,
            update: updateTaquilla,
            remove: (r) => deleteTaquilla(r.id_taquilla, r.turno),
        },
    );

    const nombreDeLinea = (id: string) => {
        const l = lineas.find((item) => item.id_linea === id);
        return l ? [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-') : '';
    };
    const nombreEstacion =
        estaciones.find((e) => e.id_linea === form.id_linea && e.id_estacion === form.id_estacion)?.nombre_estacion ?? '';

    const fields = useMemo(() => {
        const lineaOptions = lineas.map((l) => ({
            value: l.id_linea,
            label: [l.nombre_dirlin1, l.nombre_dirlin2].filter(Boolean).join('-'),
        }));
        const estacionOptions = estaciones
            .filter((e) => e.id_linea === form.id_linea)
            .map((e) => ({ value: e.id_estacion, label: e.nombre_estacion }));
        return FIELDS.map((field) => {
            if (field.key === 'id_linea') return { ...field, options: lineaOptions };
            if (field.key === 'id_estacion') return { ...field, options: estacionOptions };
            return field;
        });
    }, [lineas, estaciones, form.id_linea]);

    const onFieldChange = (key: string, value: string) => {
        // A different line invalidates the chosen station.
        if (key === 'id_linea' && value !== form.id_linea) updateField('id_estacion', '');
        updateField(key as keyof TaquillaForm, value);
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
                    form={{ ...form, nombre_linea: nombreDeLinea(form.id_linea), nombre_estacion: nombreEstacion }}
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
                selectedRow={selected}
            />
        </CatalogoLayout>
    );
}
