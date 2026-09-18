import { getPermanencias } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

interface PermanenciaForm {
    clave: string;
    nombre: string;
    descripcion: string;
    siglas: string;
}

const EMPTY_FORM: PermanenciaForm = { clave: '', nombre: '', descripcion: '', siglas: '' };

const FIELDS = [
    codeField('clave', 'Permanencia', 2, { numeric: true }),
    textField('nombre', 'Nombre', 220),
    textField('descripcion', 'Descripcion', 280),
    textField('siglas', 'Siglas', 110, { maxLength: 8 }),
];

const COLUMNS: Column<PermanenciaForm>[] = [
    { header: 'Permanencia', cell: (r) => r.clave },
    { header: 'Nombre', cell: (r) => r.nombre },
    { header: 'Descripcion', cell: (r) => r.descripcion },
    { header: 'Siglas', cell: (r) => r.siglas },
];

const loadPermanencias = async (): Promise<PermanenciaForm[]> =>
    (await getPermanencias()).map((p) => ({
        clave: p.id_permanencia,
        nombre: p.nombre_perma,
        descripcion: p.descripcion,
        siglas: p.siglas,
    }));

export default function CatalogoPermanencias() {
    const [rows, setRows] = useCatalogoRows(loadPermanencias);
    const { form, formError, updateField, clear, validate } = useCatalogoForm(EMPTY_FORM);

    const handleSave = () => {
        if (validate()) setRows((prev) => [...prev, form]);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo"
            statusLabel="Catálogo de Permanencias"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            formError={formError}
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} />}
        >
            <DataTable title="Permanencias de la red" columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
