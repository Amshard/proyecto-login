import { getLineas, getPermanencias, type Linea } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

interface LineaConPermanencia extends Linea {
    nombre_perma: string | null;
    descripcion: string | null;
}

type LineaForm = Record<keyof LineaConPermanencia, string>;

const EMPTY_FORM: LineaForm = {
    id_linea: '',
    dirdelinea1: '1',
    nombre_dirlin1: '',
    dirdelinea2: '2',
    nombre_dirlin2: '',
    estaciones: '',
    taquillas: '',
    tramos: '',
    id_permanencia: '',
    nombre_perma: '',
    descripcion: '',
};

const REQUIRED: (keyof LineaForm)[] = ['id_linea', 'dirdelinea1', 'nombre_dirlin1', 'dirdelinea2', 'nombre_dirlin2'];

const COUNT = { width: 60, wrap: 80, numeric: true };

const FIELDS = [
    codeField('id_linea', 'Línea', 2, { numeric: true, padTo: 2 }),
    codeField('dirdelinea1', 'DirIni', 5, { width: 50, wrap: 70, numeric: true }),
    textField('nombre_dirlin1', 'Nombre Dirdelinea1', 150, { maxLength: 20 }),
    codeField('dirdelinea2', 'DirFin', 5, { width: 50, wrap: 70, numeric: true }),
    textField('nombre_dirlin2', 'Nombre Dirdelinea2', 150, { maxLength: 20 }),
    codeField('estaciones', 'Estaciones', 5, COUNT),
    codeField('taquillas', 'Taquillas', 5, COUNT),
    codeField('tramos', 'Tramos', 5, { ...COUNT, wrap: 70 }),
    codeField('id_permanencia', 'Permanencia', 2, { wrap: 80, numeric: true }),
];

const COLUMNS: Column<LineaConPermanencia>[] = [
    { header: 'Línea', cell: (r) => r.id_linea },
    { header: 'Dirección', cell: (r) => r.dirdelinea1 },
    { header: 'Estación Inicial', cell: (r) => r.nombre_dirlin1 },
    { header: 'Dirección', cell: (r) => r.dirdelinea2 },
    { header: 'Estación Terminal', cell: (r) => r.nombre_dirlin2 },
    { header: 'Estaciones', cell: (r) => r.estaciones },
    { header: 'Taquillas', cell: (r) => r.taquillas },
    { header: 'Tramos', cell: (r) => r.tramos },
    { header: 'Permanencia', cell: (r) => r.id_permanencia },
    { header: 'Nombre', cell: (r) => r.nombre_perma },
    { header: 'Descripcion', cell: (r) => r.descripcion },
];

const toNumberOrNull = (value: string) => (value ? Number(value) : null);

async function loadLineas(): Promise<LineaConPermanencia[]> {
    const [lineas, permanencias] = await Promise.all([getLineas(), getPermanencias()]);
    const porId = new Map(permanencias.map((p) => [p.id_permanencia, p]));
    return lineas.map((linea) => {
        const permanencia = linea.id_permanencia ? porId.get(linea.id_permanencia) : undefined;
        return {
            ...linea,
            nombre_perma: permanencia?.nombre_perma ?? null,
            descripcion: permanencia?.descripcion ?? null,
        };
    });
}

export default function CatalogoLineas() {
    const [rows, setRows] = useCatalogoRows(loadLineas);
    const { form, formError, updateField, clear, validate } = useCatalogoForm(EMPTY_FORM, { required: REQUIRED });

    const handleSave = () => {
        if (!validate()) return;
        setRows((prev) => [
            ...prev,
            {
                id_linea: form.id_linea,
                dirdelinea1: Number(form.dirdelinea1) || 0,
                nombre_dirlin1: form.nombre_dirlin1,
                dirdelinea2: Number(form.dirdelinea2) || 0,
                nombre_dirlin2: form.nombre_dirlin2,
                estaciones: toNumberOrNull(form.estaciones),
                taquillas: toNumberOrNull(form.taquillas),
                tramos: toNumberOrNull(form.tramos),
                id_permanencia: form.id_permanencia || null,
                nombre_perma: form.nombre_perma || null,
                descripcion: form.descripcion || null,
            },
        ]);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Líneas"
            statusLabel="Catálogo de Líneas"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            formError={formError}
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} />}
        >
            <DataTable title="Líneas de la red" className="stc-table-lineas" columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
