import { getDescansos, type Descanso } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type DescansoForm = Record<keyof Descanso, string>;

const EMPTY_FORM: DescansoForm = { id_descansos: '', iniciales: '', descanso1: '', descanso2: '' };

const FIELDS = [
    codeField('id_descansos', 'Clave', 2, { numeric: true }),
    codeField('iniciales', 'Iniciales', 2),
    textField('descanso1', 'Descanso 1', 150, { maxLength: 10 }),
    textField('descanso2', 'Descanso 2', 150, { maxLength: 10 }),
];

const COLUMNS: Column<Descanso>[] = [
    { header: 'Clave', cell: (r) => r.id_descansos },
    { header: 'Iniciales', cell: (r) => r.iniciales },
    { header: 'Descanso 1', cell: (r) => r.descanso1 },
    { header: 'Descanso 2', cell: (r) => r.descanso2 },
];

export default function CatalogoDescansos() {
    const [rows, setRows] = useCatalogoRows(getDescansos);
    const { form, updateField, clear, validate } = useCatalogoForm(EMPTY_FORM);

    const handleSave = () => {
        if (validate()) setRows((prev) => [...prev, form]);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Descansos"
            statusLabel="Catálogo de Descansos"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} />}
            pdfTitle="Catálogo de Descansos"
            pdfColumns={COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Descansos"
        >
            <DataTable title="Descansos de la red" className="stc-table-descansos" columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
