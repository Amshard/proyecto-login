import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField, dateField, expedienteField, textField, useCatalogoForm } from './useCatalogo';

type ProvisionalKey =
    | 'expediente' | 'permiso' | 'nombre' | 'jub' | 'genero' | 'ingreso'
    | 'posicionRol' | 'tramo' | 'faltas' | 'taquilla' | 'categoria'
    | 'descansos' | 'lugar' | 'calificacion' | 'turno' | 'perm';

type ProvisionalForm = Record<ProvisionalKey, string>;

const EMPTY_FORM: ProvisionalForm = {
    expediente: '',
    permiso: '',
    nombre: '',
    jub: '',
    genero: '',
    ingreso: '',
    posicionRol: '',
    tramo: '',
    faltas: '',
    taquilla: '',
    categoria: '',
    descansos: '',
    lugar: '',
    calificacion: '',
    turno: '',
    perm: '',
};

const SMALL = { width: 60, wrap: 70 };

const MAIN_FIELDS = [
    expedienteField('expediente'),
    codeField('permiso', 'Permiso', 1, { wrap: 70 }),
    textField('nombre', 'Nombre', 280, { maxLength: 50 }),
    codeField('jub', 'Jub', 1, { wrap: 70 }),
    codeField('genero', 'Genero', 1, { wrap: 70 }),
    dateField('ingreso', 'Ingreso'),
];

const SMALL_FIELDS = [
    {
        ...codeField('posicionRol', 'Posición en el ROL', 4, { width: 100, wrap: 104 }),
        wrapStyle: { width: 104, textAlign: 'left' as const },
    },
    codeField('tramo', 'Tramo', 4, SMALL),
    codeField('faltas', 'Faltas', 4, SMALL),
    codeField('taquilla', 'Taquilla', 4, SMALL),
    codeField('categoria', 'Categoria', 4, SMALL),
    codeField('descansos', 'Descansos', 4, SMALL),
    codeField('lugar', 'Lugar', 4, SMALL),
    codeField('calificacion', 'Calificacion', 4, SMALL),
    codeField('turno', 'Turno', 4, SMALL),
    codeField('perm', 'Perm', 4, SMALL),
];

function formatFecha(value: string): string {
    if (!value) return '';
    const fecha = new Date(value);
    if (Number.isNaN(fecha.getTime())) return value;
    return fecha.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

const COLUMNS: Column<ProvisionalForm>[] = [
    { header: 'Expediente', cell: (r) => r.expediente },
    { header: 'Permiso', cell: (r) => r.permiso },
    { header: 'Fecha inicio', cell: (r) => formatFecha(r.ingreso) },
];

export default function PersonalProvisional() {
    const [rows, setRows] = useState<ProvisionalForm[]>([]);
    const { form, updateField, clear } = useCatalogoForm(EMPTY_FORM, { noUpper: ['ingreso'] });

    const handleSave = () => {
        setRows((prev) => [...prev, form]);
        clear();
    };

    return (
        <CatalogoLayout
            tabLabel="Personal Provisional"
            statusLabel="Catálogo de Personal Provisional"
            count={rows.length}
            onClear={clear}
            onSave={handleSave}
            reportButton="Calificacion"
        >
            <div className="stc-provisional-form">
                <ManualFields fields={MAIN_FIELDS} form={form} onChange={updateField} />
                <ManualFields
                    fields={SMALL_FIELDS}
                    form={form}
                    onChange={updateField}
                    className="stc-manual-fields stc-manual-fields-small"
                />
                <DataTable title="Personal Provisional" className="stc-table-provisional" columns={COLUMNS} rows={rows} />
            </div>
        </CatalogoLayout>
    );
}
