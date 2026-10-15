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
import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import ConfirmModal from '../../components/ConfirmModal';
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
    { ...expedienteField('expediente'), isKey: true, accept: (v: string) => v !== '0' },
    codeField('permiso', 'Permiso', 5, { width: 57, wrap: 70 }),
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
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
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
        checks: {
            expediente: (v) => (Number(v) >= 1 ? undefined : 'El campo Expediente debe ser un número mayor a 0.'),
        },
        noUpper: ['ingreso'],
        fields: [...MAIN_FIELDS, ...SMALL_FIELDS],
    });
    const { form, selected, updateField, clear, fill, keyChange, validate } = catalogoForm;
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
    // Permiso keeps its default (L00) on a new record and can only be changed on an existing one.
    const mainFields = MAIN_FIELDS.map((f) => (f.key === 'permiso' ? { ...f, readOnly: selected === null } : f));

    const rol = expediente ? rolRows.find((r) => r.id_expediente === expediente) : undefined;
    const shown = {
        ...form,
        ingreso: form.ingreso || fechaIngreso(form.expediente),
        ...lookedUp(personOf(form.expediente), rol),
    };

    const [askCalifica, setAskCalifica] = useState(false);
    const califica = async () => {
        setAskCalifica(false);
        try {
            const updated = await calificaProvisional();
            window.alert(`Calificación actualizada: Turnos=4 y Líneas=4 en ${updated} expediente(s).`);
        } catch (error) {
            window.alert(apiErrorMessage(error, 'No se pudo actualizar la calificación.'));
        }
    };

    // A new record needs an expediente that holds a position in the rol.
    const pdfColumns: Column<ProvisionalForm>[] = [
        { header: 'Expediente', cell: (r) => r.expediente },
        { header: 'Linea', cell: (r) => r.permiso },
        { header: 'Fecha', cell: (r) => r.ingreso.slice(0, 10) },
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
            onReportButton={() => setAskCalifica(true)}
            overlay={
                askCalifica && (
                    <ConfirmModal
                        message="¿ACTUALIZA CALIFICACIONES A PERSONAL PROVISIONAL?"
                        onYes={califica}
                        onNo={() => setAskCalifica(false)}
                    />
                )
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
            <div className="stc-provisional-form">
                <ManualFields fields={mainFields} form={shown} onChange={onFieldChange} />
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
