import { useMemo } from 'react';
import {
    cambiaRolVigente,
    createRolDelAnio,
    deleteRolDelAnio,
    getRolesDelAnio,
    updateRolDelAnio,
    apiErrorMessage,
    type RolDelAnio,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { useAuth } from '../../context/useAuth';
import { ddmmyyyy } from '../../utils/fechas';
import { CamposOutline } from '../Catalogos/CatalogoCampos';
import {
    catalogoActions,
    codeField,
    dateField,
    layoutProps,
    tablaProps,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from '../Catalogos/useCatalogo';
import { SideButtons } from '../Procesos/ProcesoControls';
import './Utilerias.css';

type RolForm = Record<'anio' | 'id_rol_anual' | 'nombre_rol' | 'meses_q_califica' | 'fecha_ini' | 'fecha_fin', string>;

const EMPTY_FORM: RolForm = { anio: '', id_rol_anual: '', nombre_rol: '', meses_q_califica: '', fecha_ini: '', fecha_fin: '' };

const ROLES = [
    { value: '1', label: 'PRIMER ROL' },
    { value: '2', label: 'SEGUNDO ROL' },
    { value: '3', label: 'TERCER ROL' },
    { value: '4', label: 'CUARTO ROL' },
];

const nombreRol = (rol: string) => ROLES.find((r) => r.value === rol)?.label ?? '';

const NOMBRES = ROLES.map((r) => ({ value: r.label, label: '' }));

const FIELDS = [
    { ...codeField('anio', 'Año', 4, { width: 50, numeric: true }), isKey: true },
    { ...codeField('id_rol_anual', 'Rol', 1, { width: 15, allowedChars: '1234' }), isKey: true, options: ROLES },
    { ...textField('nombre_rol', 'Nombre', 150, { maxLength: 12 }), options: NOMBRES, optionsButton: true },
    textField('meses_q_califica', 'Meses que Califica', 150, { maxLength: 12 }),
    dateField('fecha_ini', 'Del'),
    dateField('fecha_fin', 'Al'),
];

const fecha = (value: string) => ddmmyyyy(value.slice(0, 10));

const COLUMNS: Column<RolDelAnio>[] = [
    { header: 'Año', cell: (r) => r.anio, center: true },
    { header: 'Rol', cell: (r) => r.id_rol_anual, center: true },
    { header: 'Nombre', cell: (r) => r.nombre_rol },
    { header: 'Meses que Califica', cell: (r) => r.meses_q_califica },
    { header: 'Del', cell: (r) => fecha(r.fecha_ini), center: true },
    { header: 'Al', cell: (r) => fecha(r.fecha_fin), center: true },
    { header: 'Estado', cell: (r) => r.estado, center: true },
];

const formToRow = (form: RolForm, previous?: RolDelAnio): RolDelAnio => ({
    anio: Number(form.anio),
    id_rol_anual: Number(form.id_rol_anual),
    nombre_rol: form.nombre_rol,
    meses_q_califica: form.meses_q_califica,
    fecha_ini: form.fecha_ini,
    fecha_fin: form.fecha_fin,
    estado: previous?.estado ?? null,
});

const describe = (r: RolDelAnio) => `${r.nombre_rol} ${r.anio}`;

export default function CambiaRol() {
    const { refreshUser } = useAuth();
    const [rows, setRows] = useCatalogoRows(getRolesDelAnio);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        fields: FIELDS,
        checks: {
            fecha_fin: (v, f) =>
                f.fecha_ini && v < f.fecha_ini ? 'El campo Fecha Fin no puede ser anterior a la Fecha Inicio.' : undefined,
        },
    });
    const { form, selected, keyChange, updateField } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToRow, {
        create: createRolDelAnio,
        update: updateRolDelAnio,
        remove: deleteRolDelAnio,
        describe,
    });

    const onKeyChange = keyChange(['anio', 'id_rol_anual'], (f) =>
        rows.find((r) => String(r.anio) === f.anio && String(r.id_rol_anual) === f.id_rol_anual)
    );
    const onFieldChange = (field: keyof RolForm, value: string) => {
        if (field === 'nombre_rol') {
            const rol = ROLES.find((r) => r.label === value.toUpperCase());
            if (rol) onKeyChange('id_rol_anual', rol.value);
            updateField('nombre_rol', value);
            return;
        }
        onKeyChange(field, value);
        if (field === 'id_rol_anual') updateField('nombre_rol', nombreRol(value));
    };

    const asignaRol = async () => {
        const rol = selected as RolDelAnio | null;
        if (!rol) return;
        if (!window.confirm(`¿Desea que el ${describe(rol)} sea el rol vigente?`)) return;
        try {
            await cambiaRolVigente(rol);
            await refreshUser();
            window.alert(`El ${describe(rol)} es ahora el rol vigente.`);
        } catch (error) {
            window.alert(apiErrorMessage(error, 'No se pudo cambiar el rol vigente.'));
        }
    };

    const sortedRows = useMemo(
        () => [...rows].sort((a, b) => a.anio - b.anio || a.id_rol_anual - b.id_rol_anual),
        [rows]
    );

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Roles en el Año"
            statusLabel="Roles en el Año"
            {...layoutProps(rows, catalogoForm, actions)}
            actions={selected && <SideButtons buttons={[{ label: 'Asigna Rol', onClick: asignaRol }]} />}
            fields={<CamposOutline completo fields={FIELDS} form={form} onChange={onFieldChange} />}
            reportTitle="Roles en el Año"
            pdf={{
                title: 'ROLES EN EL AÑO',
                footerTitle: 'RptRolesAnio',
                columns: COLUMNS,
                rows: sortedRows,
                countLabel: 'Total de Roles',
            }}
        >
            <DataTable
                title="Roles"
                className="stc-table-roles"
                rowHeader={2}
                columns={COLUMNS}
                rows={sortedRows}
                {...tablaProps<RolDelAnio>(catalogoForm)}
            />
        </CatalogoLayout>
    );
}
