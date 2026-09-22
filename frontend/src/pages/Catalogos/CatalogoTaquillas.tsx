import { getTaquillas, type Taquilla } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

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

const REQUIRED: (keyof TaquillaForm)[] = ['id_taquilla', 'turno', 'dirdelinea', 'id_linea', 'id_estacion'];

const FIELDS = [
    codeField('id_taquilla', 'Taquilla', 5, { width: 60, wrap: 80, numeric: true }),
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

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
    const { form, updateField, clear, validate } = useCatalogoForm(EMPTY_FORM, { required: REQUIRED });

    const handleSave = () => {
        if (!validate()) return;
        setRows((prev) => [
            ...prev,
            {
                ...form,
                dirdelinea: Number(form.dirdelinea) || 0,
                extension_tel: form.extension_tel || null,
            },
        ]);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Taquillas y sus Turnos"
            statusLabel="Catálogo de Taquillas"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            reportButton="Reporte Taquillas en Operaciones"
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} />}
            pdfTitle="Catálogo de Taquillas"
            pdfColumns={COLUMNS}
            pdfRows={rows}
            pdfCountLabel="Taquillas"
        >
            <DataTable title="Taquillas de la red" className="stc-table-taquillas" columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
