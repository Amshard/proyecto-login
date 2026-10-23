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

type GacetaForm = Record<keyof PersonalGaceta, string>;

const EMPTY_FORM: GacetaForm = { exp: '', permiso: 'L00', fecha: '' };

const SMALL = { width: 60, wrap: 70 };

const MAIN_FIELDS = [
    { ...expedienteField('exp'), isKey: true, accept: (v: string) => v !== '0' },
    codeField('permiso', 'Permiso', 4, { width: 57, wrap: 70 }),
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
const day = (value: unknown) => text(value).slice(0, 10);

const lookedUp = (person: PersonalTaquilla | undefined, rol: RolTaquilla | undefined) => ({
    nombre: text(person?.nombre),
    jub: text(person?.prejubilacion),
    genero: text(person?.sexo),
    ingreso: day(person?.fecha_ingreso),
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

const formatFecha = (value: unknown) => day(value).split('-').reverse().join('/');

const COLUMNS: Column<PersonalGaceta>[] = [
    { header: 'Expediente', cell: (r) => r.exp },
    { header: 'Permiso', cell: (r) => r.permiso },
    { header: 'Fecha inicio', cell: (r) => formatFecha(r.fecha) },
];

export default function PersonalProvisional() {
    const [rows, setRows] = useCatalogoRows(getPersonalGaceta);
    const [personal] = useCatalogoRows(getPersonalTaquilla);
    const [rolRows] = useCatalogoRows(getRolTaquilla);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: ['exp', 'permiso'],
        checks: { exp: (v) => (Number(v) >= 1 ? undefined : 'El campo Expediente debe ser un número mayor a 0.') },
        noUpper: ['fecha'],
        fields: [...MAIN_FIELDS, ...ROL_FIELDS],
    });
    const { form, selected, clear, fill, keyChange, validate } = catalogoForm;

    const personOf = (exp: number) => personal.find((p) => p.id_expediente === exp);
    const exp = Number(form.exp);
    const rol = exp ? rolRows.find((r) => r.id_expediente === exp) : undefined;
    const shown = { ...form, ...lookedUp(personOf(exp), rol) };

    const actions = catalogoActions(
        setRows,
        catalogoForm,
        (f): PersonalGaceta => ({ exp: Number(f.exp), permiso: f.permiso || null, fecha: f.fecha || null }),
        {
            create: createPersonalGaceta,
            update: updatePersonalGaceta,
            remove: (r) => deletePersonalGaceta(r.exp),
        }
    );
    const onFieldChange = keyChange(['exp'], (f) => rows.find((r) => String(r.exp) === f.exp));

    const onSave = async () => {
        if (!validate()) return false;
        if (!rol) {
            window.alert('No existe en el ROL');
            return false;
        }
        return actions.onSave();
    };

    const califica = async () => {
        if (!window.confirm('¿Actualiza calificaciónes a Personal Provisional?')) return;
        try {
            const updated = await calificaProvisional();
            window.alert(`Calificación actualizada: Turnos=4 y Líneas=4 en ${updated} expediente(s).`);
        } catch (error) {
            window.alert(apiErrorMessage(error, 'No se pudo actualizar la calificación.'));
        }
    };

    const mainFields = MAIN_FIELDS.map((f) => (f.key === 'permiso' ? { ...f, readOnly: selected === null } : f));

    const pdfColumns: Column<PersonalGaceta>[] = [
        { header: 'Expediente', cell: (r) => r.exp },
        { header: 'Linea', cell: (r) => r.permiso },
        { header: 'Fecha', cell: (r) => day(r.fecha) },
        { header: 'Nombre', cell: (r) => personOf(r.exp)?.nombre, centerHeader: true },
        { header: 'Fecha Ing', cell: (r) => day(personOf(r.exp)?.fecha_ingreso) },
    ];

    return (
        <CatalogoLayout
            tabLabel="Personal Provisional"
            statusLabel="Catalogo de Personal Provisional"
            count={rows.length}
            onClear={clear}
            {...actions}
            onSave={onSave}
            editing={selected !== null}
            reportButton="Califica Turnos=4 Líneas=4"
            onReportButton={califica}
            fields={
                <>
                    <ManualFields
                        fields={mainFields}
                        form={shown}
                        onChange={(key, value) => onFieldChange(key as keyof GacetaForm, value)}
                    />
                    <ManualFields
                        fields={ROL_FIELDS}
                        form={shown}
                        onChange={() => {}}
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
                activeRow={selected as PersonalGaceta | null}
            />
        </CatalogoLayout>
    );
}
