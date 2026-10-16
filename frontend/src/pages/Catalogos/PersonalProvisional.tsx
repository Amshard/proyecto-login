import {
    apiErrorMessage,
    calificaProvisional,
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
    | 'fecha' | 'posicionRol' | 'tramo' | 'faltas' | 'taquilla' | 'categoria'
    | 'descansos' | 'lugar' | 'calificacion' | 'turno' | 'perm';

type ProvisionalForm = Record<ProvisionalKey, string>;

const EMPTY_FORM: ProvisionalForm = {
    expediente: '',
    permiso: 'L00',
    nombre: '',
    jub: '',
    genero: '',
    ingreso: '',
    fecha: '',
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
    { ...expedienteField('expediente'), isKey: true, accept: (v: string) => v !== '0' },
    codeField('permiso', 'Permiso', 5, { width: 57, wrap: 70 }),
    { ...textField('nombre', 'Nombre', 280, { maxLength: 50 }), readOnly: true },
    { ...codeField('jub', 'Jub', 1, { wrap: 70 }), readOnly: true },
    { ...codeField('genero', 'Genero', 1, { wrap: 70 }), readOnly: true },
    { ...dateField('ingreso', 'Ingreso'), readOnly: true },
    dateField('fecha', 'Fecha Inicio'),
];

const POSICION_ROL = codeField('posicionRol', 'Posición en el ROL', 4, { width: 100, wrap: 104 });

const ROL_FIELDS = [
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
    ingreso: text(person?.fecha_ingreso).slice(0, 10),
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
        fecha: g.fecha ?? '',
    };
}

const formToGaceta = (f: ProvisionalForm): PersonalGaceta => ({
    exp: Number(f.expediente),
    permiso: f.permiso || null,
    fecha: f.fecha || null,
});

const loadGaceta = async () => (await getPersonalGaceta()).map(gacetaToForm);

function formatFecha(value: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

const COLUMNS: Column<ProvisionalForm>[] = [
    { header: 'Expediente', cell: (r) => r.expediente },
    { header: 'Permiso', cell: (r) => r.permiso },
    { header: 'Fecha inicio', cell: (r) => formatFecha(r.fecha) },
];

export default function PersonalProvisional() {
    const [rows, setRows] = useCatalogoRows(loadGaceta);
    const [personal] = useCatalogoRows(getPersonalTaquilla);
    const [rolRows] = useCatalogoRows(getRolTaquilla);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: ['expediente', 'permiso'],
        checks: {
            expediente: (v) => (Number(v) >= 1 ? undefined : 'El campo Expediente debe ser un número mayor a 0.'),
        },
        noUpper: ['fecha'],
        fields: [...MAIN_FIELDS, ...ROL_FIELDS],
    });
    const { form, selected, updateField, clear, fill, keyChange, validate } = catalogoForm;
    const personOf = (expediente: string) => personal.find((p) => String(p.id_expediente) === expediente);
    const fechaIngreso = (expediente: string) => text(personOf(expediente)?.fecha_ingreso).slice(0, 10);
    const actions = catalogoActions(
        setRows,
        catalogoForm,
        (f) => ({ ...f }),
        {
            create: (r) => createPersonalGaceta(formToGaceta(r)),
            update: (r) => updatePersonalGaceta(formToGaceta(r)),
            remove: (r) => deletePersonalGaceta(Number(r.expediente)),
        }
    );
    const onFieldChange = keyChange(['expediente'], (f) => rows.find((r) => r.expediente === f.expediente));

    const expediente = Number(form.expediente);
    const mainFields = MAIN_FIELDS.map((f) => (f.key === 'permiso' ? { ...f, readOnly: selected === null } : f));

    const rol = expediente ? rolRows.find((r) => r.id_expediente === expediente) : undefined;
    const shown = {
        ...form,
        ...lookedUp(personOf(form.expediente), rol),
    };

    const califica = async () => {
        if (!window.confirm('¿ACTUALIZA CALIFICACIONES A PERSONAL PROVISIONAL?')) return;
        try {
            const updated = await calificaProvisional();
            window.alert(`Calificación actualizada: Turnos=4 y Líneas=4 en ${updated} expediente(s).`);
        } catch (error) {
            window.alert(apiErrorMessage(error, 'No se pudo actualizar la calificación.'));
        }
    };

    const pdfColumns: Column<ProvisionalForm>[] = [
        { header: 'Expediente', cell: (r) => r.expediente },
        { header: 'Linea', cell: (r) => r.permiso },
        { header: 'Fecha', cell: (r) => r.fecha.slice(0, 10) },
        { header: 'Nombre', cell: (r) => personOf(r.expediente)?.nombre, centerHeader: true },
        { header: 'Fecha Ing', cell: (r) => fechaIngreso(r.expediente) },
    ];

    const onSave = async () => {
        if (!validate()) return false;
        if (!rol) {
            window.alert('No existe en el ROL');
            return false;
        }
        return actions.onSave();
    };

    return (
        <CatalogoLayout
            tabLabel="Personal Provisional"
            statusLabel="CatGaceta"
            count={rows.length}
            onClear={clear}
            {...actions}
            onSave={onSave}
            editing={selected !== null}
            reportButton="Califica Turnos=4 Líneas=4"
            onReportButton={califica}
            fields={
                <>
                    <ManualFields fields={mainFields} form={shown} onChange={onFieldChange} />
                    <ManualFields
                        fields={ROL_FIELDS}
                        form={shown}
                        onChange={updateField}
                        className="stc-manual-fields stc-manual-fields-small"
                    />
                </>
            }
            pdf={{
                title: 'PERSONAL PROVISIONAL POR CIERRE DE LINEA 1 Y 12',
                footerTitle: 'RptCatGaceta',
                columns: pdfColumns,
                rows,
                countText: (r) => [`Total de Taquilleras: ${r.length}`, 'Total General de Taquilleras:'],
                countBold: true,
                countUnderline: true,
            }}
        >
            <DataTable
                title="Personal Provisional"
                className="stc-table-provisional"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
                activeRow={selected as ProvisionalForm | null}
            />
        </CatalogoLayout>
    );
}
