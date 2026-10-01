import { createDescanso, deleteDescanso, type Descanso, getDescansos } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type DescansoForm = Record<keyof Descanso, string>;

const EMPTY_FORM: DescansoForm = { id_descansos: '', iniciales: '', descanso1: '', descanso2: '' };

const FIELDS = [
    { ...codeField('id_descansos', 'Clave', 2, { numeric: true }), isKey: true },
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
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, (f) => ({ ...f }), {
        create: createDescanso,
        remove: (r) => deleteDescanso(r.id_descansos),
    });
    const onFieldChange = keyChange(['id_descansos'], (f) => rows.find((r) => String(r.id_descansos) === f.id_descansos));

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Descansos"
            statusLabel="Catálogo de Descansos"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            fields={<ManualFields fields={FIELDS} form={form} onChange={onFieldChange} lockValues={selected !== null} />}
            pdf={{ title: 'Catálogo de Descansos', columns: COLUMNS, rows, countLabel: 'Descansos' }}
        >
            <DataTable
                title="Descansos de la red"
                className="stc-table-descansos"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
                activeRow={selected as Descanso | null}
            />
        </CatalogoLayout>
    );
}
