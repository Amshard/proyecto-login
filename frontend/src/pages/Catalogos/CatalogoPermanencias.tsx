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

interface PermanenciaForm {
    clave: string;
    nombre: string;
    descripcion: string;
    siglas: string;
}

const EMPTY_FORM: PermanenciaForm = { clave: '', nombre: '', descripcion: '', siglas: '' };

const FIELDS = [
    { ...codeField('clave', 'Permanencia', 1, { numeric: true }), isKey: true },
    textField('nombre', 'Nombre', 220, { maxLength: 15 }),
    textField('descripcion', 'Descripcion', 280, { maxLength: 30 }),
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

const toPermanencia = (r: PermanenciaForm): Permanencia => ({
    id_permanencia: r.clave,
    nombre_perma: r.nombre,
    descripcion: r.descripcion,
    siglas: r.siglas,
});

export default function CatalogoPermanencias() {
    const [rows, setRows] = useCatalogoRows(loadPermanencias);
    const catalogoForm = useCatalogoForm(EMPTY_FORM);
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const { onSave, onModify, onDelete } = catalogoActions(
        setRows,
        catalogoForm,
        (f) => ({ ...f }),
        {
            create: (r) => createPermanencia(toPermanencia(r)),
            update: (r) => updatePermanencia(toPermanencia(r)),
            remove: (r) => deletePermanencia(r.clave),
        },
    );

    return (
        <CatalogoLayout
            tabLabel="Catálogo"
            statusLabel="Catálogo de Permanencias"
            count={rows.length}
            onClear={clear}
            onSave={onSave}
            onModify={onModify}
            onDelete={onDelete}
            editing={selected !== null}
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} lockKeys={selected !== null} />}
            pdfTitle="Catálogo de Permanencias"
            pdfColumns={COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Permanencias"
        >
            <DataTable
                title="Permanencias de la red"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
                selectedRow={selected}
            />
        </CatalogoLayout>
    );
}
