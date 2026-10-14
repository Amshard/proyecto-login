import {
    createPersonalGaceta,
    deletePersonalGaceta,
    getPersonalGaceta,
    getPersonalTaquilla,
    getRolTaquilla,
    type PersonalGaceta,
    type PersonalTaquilla,
    type RolTaquilla,
    updatePersonalGaceta,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, dateField, expedienteField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type ProvisionalKey =
    | 'expediente' | 'permiso' | 'nombre' | 'jub' | 'genero' | 'ingreso'
    | 'posicionRol' | 'tramo' | 'faltas' | 'taquilla' | 'categoria'
    | 'descansos' | 'lugar' | 'calificacion' | 'turno' | 'perm';

type ProvisionalForm = Record<ProvisionalKey, string>;

const EMPTY_FORM: ProvisionalForm = {
    expediente: '',
    permiso: 'L00',
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

// Expediente, Permiso and Ingreso are typed in; the rest are looked up.
const MAIN_FIELDS = [
    { ...expedienteField('expediente'), isKey: true },
    codeField('permiso', 'Permiso', 5, { width: 27, wrap: 70 }),
    { ...textField('nombre', 'Nombre', 280, { maxLength: 50 }), readOnly: true },
    { ...codeField('jub', 'Jub', 1, { wrap: 70 }), readOnly: true },
    { ...codeField('genero', 'Genero', 1, { wrap: 70 }), readOnly: true },
    dateField('ingreso', 'Ingreso'),
];

const POSICION_ROL = codeField('posicionRol', 'Posición en el ROL', 4, { width: 100, wrap: 104 });

const SMALL_FIELDS = [
    { ...POSICION_ROL, wrapStyle: { ...POSICION_ROL.wrapStyle, textAlign: 'left' as const } },
    codeField('tramo', 'Tramo', 4, SMALL),
    codeField('faltas', 'Faltas', 4, SMALL),
    codeField('taquilla', 'Taquilla', 4, SMALL),
    codeField('categoria', 'Categoria', 4, SMALL),
    codeField('descansos', 'Descansos', 4, SMALL),
    codeField('lugar', 'Lugar', 4, SMALL),
    codeField('calificacion', 'Calificacion', 4, SMALL),
    codeField('turno', 'Turno', 4, SMALL),
    codeField('perm', 'Perm', 4, SMALL),
].map((f) => ({ ...f, readOnly: true }));

const text = (value: unknown) => (value == null ? '' : String(value));

const lookedUp = (person: PersonalTaquilla | undefined, rol: RolTaquilla | undefined): Partial<ProvisionalForm> => ({
    nombre: text(person?.nombre),
    jub: text(person?.prejubilacion),
    genero: text(person?.sexo),
    posicionRol: text(rol?.numero),
    tramo: text(rol?.id_tramo),
    faltas: text(rol?.faltas),
    taquilla: text(rol?.id_taquilla),
    categoria: text(rol?.categoria),
    descansos: text(rol?.id_descansos),
    lugar: text(rol?.lugar),
    calificacion: text(rol?.calificacion),
    turno: text(rol?.turno),
    perm: text(rol?.id_permanencia),
});

function gacetaToForm(g: PersonalGaceta): ProvisionalForm {
    return {
        ...EMPTY_FORM,
        expediente: g.exp != null ? String(g.exp) : '',
        permiso: g.permiso ?? '',
        ingreso: g.fecha ?? '',
    };
}

const formToGaceta = (f: ProvisionalForm): PersonalGaceta => ({
    exp: Number(f.expediente),
    permiso: f.permiso || null,
    fecha: f.ingreso || null,
});

const loadGaceta = async () => (await getPersonalGaceta()).map(gacetaToForm);

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
    const [rows, setRows] = useCatalogoRows(loadGaceta);
    const [personal] = useCatalogoRows(getPersonalTaquilla);
    const [rolRows] = useCatalogoRows(getRolTaquilla);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: ['expediente', 'permiso'],
        noUpper: ['ingreso'],
        fields: [...MAIN_FIELDS, ...SMALL_FIELDS],
    });
    const { form, selected, updateField, clear, fill, keyChange } = catalogoForm;
    const personOf = (expediente: string) => personal.find((p) => String(p.id_expediente) === expediente);
    // Ingreso starts as the person's Fecha de Ingreso and can be changed.
    const fechaIngreso = (expediente: string) => text(personOf(expediente)?.fecha_ingreso).slice(0, 10);
    const actions = catalogoActions(
        setRows,
        catalogoForm,
        (f) => ({ ...f, ingreso: f.ingreso || fechaIngreso(f.expediente) }),
        {
            create: (r) => createPersonalGaceta(formToGaceta(r)),
            update: (r) => updatePersonalGaceta(formToGaceta(r)),
            remove: (r) => deletePersonalGaceta(Number(r.expediente)),
        }
    );
    const onFieldChange = keyChange(['expediente'], (f) => rows.find((r) => r.expediente === f.expediente));

    const expediente = Number(form.expediente);
    const shown = {
        ...form,
        ingreso: form.ingreso || fechaIngreso(form.expediente),
        ...lookedUp(
            personOf(form.expediente),
            expediente ? rolRows.find((r) => r.id_expediente === expediente) : undefined
        ),
    };

    return (
        <CatalogoLayout
            tabLabel="Personal Provisional"
            statusLabel="Catálogo de Personal Provisional"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            reportButton="Califica Turnos=4 Líneas=4"
            pdf={{ title: 'Catálogo de Personal Provisional', columns: COLUMNS, rows, countLabel: 'Personal Provisional' }}
        >
            <div className="stc-provisional-form">
                <ManualFields fields={MAIN_FIELDS} form={shown} onChange={onFieldChange} />
                <ManualFields
                    fields={SMALL_FIELDS}
                    form={shown}
                    onChange={updateField}
                    className="stc-manual-fields stc-manual-fields-small"
                />
                <DataTable
                    title="Personal Provisional"
                    className="stc-table-provisional"
                    columns={COLUMNS}
                    rows={rows}
                    onRowSelect={fill}
                    activeRow={selected as ProvisionalForm | null}
                />
            </div>
        </CatalogoLayout>
    );
}
