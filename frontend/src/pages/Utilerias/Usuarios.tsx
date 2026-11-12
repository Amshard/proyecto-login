import { useMemo } from 'react';
import { createUsuario, deleteUsuario, getUsuarios, updateUsuario, type Usuario } from '../../api/auth';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { isoDate } from '../../utils/fechas';
import { CamposOutline } from '../Catalogos/CatalogoCampos';
import {
    catalogoActions,
    codeField,
    labelLeft,
    layoutProps,
    tablaProps,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from '../Catalogos/useCatalogo';
import './Utilerias.css';

type UsuarioForm = Record<'id_usuario' | 'nombre' | 'password' | 'estatus' | 'tipo_usuario' | 'descri_usuario', string>;

const EMPTY_FORM: UsuarioForm = {
    id_usuario: '',
    nombre: '',
    password: '',
    estatus: '',
    tipo_usuario: '',
    descri_usuario: '',
};

const ESTATUS = [
    { value: 'A', label: 'ACTIVO' },
    { value: 'B', label: 'BAJA' },
];

const TIPOS = [
    { value: '1', label: 'TAQUILLERA' },
    { value: '2', label: 'SUPERVISION' },
    { value: '3', label: 'ADMINISTRADOR' },
];

const nombreTipo = (tipo: string) => TIPOS.find((t) => t.value === tipo)?.label ?? '';

const password = textField('password', 'Password', 150, { maxLength: 16 });
const nombre = textField('nombre', 'Nombre', 460, { maxLength: 60 });

const FIELDS = [
    { ...codeField('id_usuario', 'Usuario', 5, { width: 50, wrap: 70 }), isKey: true, autoComplete: 'off' },
    { ...password, type: 'password', autoComplete: 'new-password', inputStyle: { ...password.inputStyle, textTransform: 'none' as const } },
    { ...nombre, inputStyle: { ...nombre.inputStyle, width: nombre.inputStyle?.maxWidth }, breakAfter: true },
    { ...codeField('estatus', 'Estatus: Activo/Baja', 1, { width: 15, wrap: 60, allowedChars: 'AB' }), options: ESTATUS },
    { ...codeField('tipo_usuario', 'Tipo de Usuario', 1, { width: 15, wrap: 100, allowedChars: '123' }), options: TIPOS },
    textField('descri_usuario', 'Descripcion', 200, { maxLength: 20 }),
].map(labelLeft);

const COLUMNS: Column<Usuario>[] = [
    { header: 'Usuario', cell: (r) => r.id_usuario, center: true },
    { header: 'Password', cell: (r) => r.password },
    { header: 'Nombre', cell: (r) => r.nombre },
    { header: 'Edo', cell: (r) => r.estatus, center: true },
    { header: 'Tipo', cell: (r) => r.tipo_usuario, center: true },
    { header: 'Descripcion', cell: (r) => r.descri_usuario },
];

const formToUsuario = (form: UsuarioForm, previous?: Usuario): Usuario => {
    const hoy = isoDate();
    const cambiaEstatus = form.estatus !== (previous?.estatus ?? 'A');
    const cambiaPassword = !!form.password && form.password !== previous?.password;
    return {
        id_usuario: form.id_usuario,
        nombre: form.nombre,
        estatus: form.estatus,
        tipo_usuario: form.tipo_usuario,
        descri_usuario: form.descri_usuario || null,
        password: form.password || undefined,
        fecha_alta: previous ? previous.fecha_alta : hoy,
        fecha_baja: cambiaEstatus ? (form.estatus === 'B' ? hoy : null) : (previous?.fecha_baja ?? null),
        fecha_modif: previous && !cambiaPassword ? previous.fecha_modif : null,
    };
};

export default function Usuarios() {
    const [rows, setRows] = useCatalogoRows(getUsuarios);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: ['id_usuario', 'nombre', 'estatus', 'tipo_usuario', 'descri_usuario'],
        noUpper: ['password'],
        fields: FIELDS,
    });
    const { form, keyChange, updateField } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToUsuario, {
        create: createUsuario,
        update: updateUsuario,
        remove: (r) => deleteUsuario(r.id_usuario),
        describe: (r) => `Usuario ${r.id_usuario}`,
        savedNote: () => 'El usuario deberá cambiar su password al iniciar sesión.',
    });

    const onSave = async () => {
        if (!form.password.trim()) {
            window.alert('El campo Password está vacío.');
            return false;
        }
        return actions.onSave();
    };

    const onKeyChange = keyChange(['id_usuario'], (f) => rows.find((r) => r.id_usuario === f.id_usuario));
    const usuarioChange = (field: keyof UsuarioForm, value: string) => {
        onKeyChange(field, value);
        if (field === 'tipo_usuario') updateField('descri_usuario', nombreTipo(value));
    };

    const tableColumns = useMemo<Column<Usuario>[]>(() => {
        const regOf = new Map(rows.map((row, i) => [row, i + 1]));
        return [{ header: 'Reg', cell: (r) => regOf.get(r), center: true }, ...COLUMNS];
    }, [rows]);

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Usuarios"
            statusLabel="Catálogo de Usuarios"
            {...layoutProps(rows, catalogoForm, actions)}
            onSave={onSave}
            hideTabs
            fields={
                <div className="stc-utilerias-campos">
                    <CamposOutline completo porLinea fields={FIELDS} form={form} onChange={usuarioChange} />
                </div>
            }
        >
            <DataTable
                title="Datos del Usuario"
                className="stc-table-usuarios"
                rowHeader
                columns={tableColumns}
                rows={rows}
                {...tablaProps<Usuario>(catalogoForm)}
            />
        </CatalogoLayout>
    );
}
