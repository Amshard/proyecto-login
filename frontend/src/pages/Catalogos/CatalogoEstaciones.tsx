import { getEstaciones, type Estacion } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

const FIELDS = [
    codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }),
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
    const { form, formError, updateField, clear, validate } = useCatalogoForm(EMPTY_FORM);

    const handleSave = () => {
        if (validate()) setRows((prev) => [...prev, form]);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Estaciones"
            statusLabel="Catálogo de Estaciones"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            formError={formError}
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} />}
        >
            <DataTable title="Estaciones" columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
