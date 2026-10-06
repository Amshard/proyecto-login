import { createDescanso, deleteDescanso, type Descanso, getDescansos } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type DescansoForm = Record<keyof Descanso, string>;

const EMPTY_FORM: DescansoForm = { id_descansos: '', iniciales: '', descanso1: '', descanso2: '' };

const FIELDS = [
    { ...codeField('id_descansos', 'Clave', 2, { numeric: true, allowedChars: '01234567' }), isKey: true, },
    { ...codeField('iniciales', 'Iniciales', 2), readOnly: true },
    textField('descanso1', 'Descanso 1', 150, { maxLength: 10 }),
    textField('descanso2', 'Descanso 2', 150, { maxLength: 10 }),
];

const isValidClave = (clave: string) => {
    if (clave === '71') return true;
    const [first, second] = [...clave].map(Number);
    return first >= 1 && first < second && second <= 7;
};

const DAY_INITIALS = ['', 'L', 'M', 'M', 'J', 'V', 'S', 'D'];

const claveIniciales = (clave: string) => (isValidClave(clave) ? [...clave].map((d) => DAY_INITIALS[Number(d)]).join('') : '');

const COLUMNS: Column<Descanso>[] = [
    { header: 'Clave', cell: (r) => r.id_descansos },
    { header: 'Iniciales', cell: (r) => r.iniciales },
    { header: 'Descanso 1', cell: (r) => r.descanso1 },
    { header: 'Descanso 2', cell: (r) => r.descanso2 },
];

export default function CatalogoDescansos() {
    const [rows, setRows] = useCatalogoRows(getDescansos);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, clear, fill, keyChange, updateField } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, (f) => ({ ...f }), {
        create: createDescanso,
        remove: (r) => deleteDescanso(r.id_descansos),
    });
    const onSave = async () => {
        if (form.id_descansos.trim() !== '' && !isValidClave(form.id_descansos)) {
            window.alert('La clave del segundo descanso debe de ser consecutivo');
            return false;
        }
        return actions.onSave();
    };
    const onKeyChange = keyChange(['id_descansos'], (f) => rows.find((r) => String(r.id_descansos) === f.id_descansos));
    const onFieldChange = (field: keyof DescansoForm, value: string) => {
        onKeyChange(field, value);
        if (field === 'id_descansos') updateField('iniciales', claveIniciales(value));
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Descansos"
            statusLabel="Catálogo de Descansos"
            count={rows.length}
            onClear={clear}
            {...actions}
            onSave={onSave}
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
