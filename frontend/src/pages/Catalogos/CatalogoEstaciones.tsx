import { createEstacion, deleteEstacion, type Estacion, getEstaciones, updateEstacion } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }), isKey: true },
    codeField('id_estacion', 'Estación', 2, { numeric: true, padTo: 2 }),
    textField('nombre_estacion', 'Nombre', 280, { maxLength: 25 }),
];

const COLUMNS: Column<Estacion>[] = [
    { header: 'Línea', cell: (r) => r.id_linea },
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Nombre de Estación', cell: (r) => r.nombre_estacion },
];

export default function CatalogoEstaciones() {
    const [rows, setRows] = useCatalogoRows(getEstaciones);
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
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} lockKeys={selected !== null} />}
            pdfTitle="Catálogo de Estaciones"
            pdfColumns={COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Estaciones"
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
