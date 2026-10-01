import {
    createPermanencia,
    deletePermanencia,
    getPermanencias,
    type Permanencia,
    updatePermanencia,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

const EMPTY_FORM: Permanencia = { id_permanencia: '', nombre_perma: '', descripcion: '', siglas: '' };

const FIELDS = [
    { ...codeField('id_permanencia', 'Permanencia', 1, { numeric: true }), isKey: true },
    textField('nombre_perma', 'Nombre', 220, { maxLength: 15 }),
    textField('descripcion', 'Descripcion', 280, { maxLength: 30 }),
    textField('siglas', 'Siglas', 110, { maxLength: 8 }),
];

const COLUMNS: Column<Permanencia>[] = [
    { header: 'Permanencia', cell: (r) => r.id_permanencia, indent: 40, fit: true, center: true },
    { header: 'Nombre', cell: (r) => r.nombre_perma },
    { header: 'Descripcion', cell: (r) => r.descripcion },
    { header: 'Siglas', cell: (r) => r.siglas },
];

export default function CatalogoPermanencias() {
    const [rows, setRows] = useCatalogoRows(getPermanencias);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, (f) => ({ ...f }), {
        create: createPermanencia,
        update: updatePermanencia,
        remove: (r) => deletePermanencia(r.id_permanencia),
    });
    const onFieldChange = keyChange(['id_permanencia'], (f) => rows.find((r) => String(r.id_permanencia) === f.id_permanencia));

    return (
        <CatalogoLayout
            tabLabel="Catálogo"
            statusLabel="Catálogo de Permanencias"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={FIELDS}
                    form={form}
                    onChange={onFieldChange}
                />
            }
            pdf={{
                title: 'CATÁLOGO DE PERMANENCIAS',
                columns: COLUMNS,
                rows,
                countLabel: 'Permanencias',
                countTitle: 'Total Permanencias',
                noteLabel: 'Permanencia',
                noteById: true,
                countUnderlineSplit: true,
            }}
        >
            <DataTable title="Permanencias de la red" columns={COLUMNS}                 rows={rows}
                onRowSelect={fill}
                activeRow={selected as Permanencia | null}
            />
        </CatalogoLayout>
    );
}
