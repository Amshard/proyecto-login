import { createTaquilla, deleteTaquilla, getTaquillas, type Taquilla, updateTaquilla } from '../../api/catalogos';
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
    { ...codeField('id_taquilla', 'Taquilla', 5, { width: 60, wrap: 80, numeric: true }), isKey: true },
    codeField('turno', 'Turno', 1, { numeric: true }),
    codeField('dirdelinea', 'Dir. Línea', 5, { width: 60, wrap: 90, numeric: true }),
    textField('extension_tel', 'Extensión', 110, { maxLength: 10, wrap: 130 }),
    codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }),
    codeField('id_estacion', 'Estación', 2, { numeric: true, padTo: 2 }),
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

// Keeps fields the form doesn't edit (e.g. direccion) from the original row.
const formToTaquilla = (form: TaquillaForm, previous?: Taquilla): Taquilla => ({
    ...previous,
    ...form,
    dirdelinea: Number(form.dirdelinea) || 0,
    extension_tel: form.extension_tel || null,
});

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
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
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} lockKeys={selected !== null} />}
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
