import { useState } from 'react';
import { getRolesDelAnio, getRolesHist, type RolDelAnio, type RolHist } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import { useBusqueda } from '../../components/useBusqueda';
import { useAuth } from '../../context/useAuth';
import type { RolVigente } from '../../types/auth.types';
import { ddmmyyyy } from '../../utils/fechas';
import { codeField, dateField, textField, texto, useCatalogoRows } from '../Catalogos/useCatalogo';
import { sameHeight } from './procesoFields';
import ProgressBar from './ProgressBar';
import '../Catalogos/Catalogos.css';
import './Procesos.css';

type RespaldoKey = 'rol1' | 'rol2' | 'rol3' | 'fecha_inicial' | 'fecha_final' | 'meses_califica' | 'estado';

const ROL_FIELDS = [
    codeField('rol1', 'Rol Vigente', 4, { width: 50, wrap: 50 }),
    codeField('rol2', ' ', 5, { width: 40, wrap: 40 }),
    textField('rol3', ' ', 110),
].map(sameHeight);

const ESTADO = textField('estado', 'Estado', 100);

const FIELDS = [
    dateField('fecha_inicial', 'Fecha Inicial'),
    dateField('fecha_final', 'Fecha Final'),
    textField('meses_califica', 'Meses Califica', 110),
    { ...ESTADO, inputStyle: { ...ESTADO.inputStyle, textTransform: 'none' as const } },
].map(sameHeight);

const rolForm = (rol: RolVigente | null | undefined): Record<RespaldoKey, string> => ({
    rol1: texto(rol?.fecha_fin).slice(0, 4),
    rol2: texto(rol?.id_rol_anual),
    rol3: texto(rol?.nombre_rol),
    fecha_inicial: texto(rol?.fecha_ini).slice(0, 10),
    fecha_final: texto(rol?.fecha_fin).slice(0, 10),
    meses_califica: texto(rol?.meses_q_califica),
    estado: rol ? (texto(rol.estatus_roldescansos).trim().toUpperCase() === 'ROLADO' ? 'ROLADO' : 'NO ROLADO') : '',
});

const fecha = (value: string | null) => (value ? ddmmyyyy(value.slice(0, 10)) : '');

const COLUMNS: Column<RolHist>[] = [
    { header: 'Año', cell: (r) => r.rol_anio, center: true },
    { header: 'Rol', cell: (r) => r.rol_num, center: true },
    { header: 'Mes Inicid', cell: (r) => r.inc_cargadas, center: true },
    { header: 'Fech_ini', cell: (r) => fecha(r.fec_ini_rol), center: true },
    { header: 'Fech_Fin', cell: (r) => fecha(r.fec_fin_rol), center: true },
    { header: 'Fec_Respldo', cell: (r) => fecha(r.fecha_respaldo), center: true },
    { header: 'Lugares', cell: (r) => r.conta, center: true },
];

export default function RespaldaRolVigente() {
    const [rows] = useCatalogoRows(getRolesHist);
    const [rolesDelAnio] = useCatalogoRows(getRolesDelAnio);
    const [siguiente, setSiguiente] = useState<RolDelAnio | null>(null);
    const busqueda = useBusqueda(rows);
    const { user } = useAuth();
    const form = siguiente ? rolForm({ ...siguiente, estatus_roldescansos: siguiente.estado }) : rolForm(user?.rol_vigente);
    const field = (config: ManualFieldConfig<RespaldoKey>) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={() => {}} readOnly />
    );

    const respalda = async () => {
        const rol = `${form.rol1} Rol ${form.rol2}`;
        if (form.estado !== 'ROLADO') {
            window.alert(`El Rol Vigente ${rol} no está ROLADO.`);
            return;
        }
        if (!rows.some((r) => String(r.rol_anio) === form.rol1 && String(r.rol_num) === form.rol2)) {
            window.alert(`No existe respaldo del Rol Vigente ${rol}.`);
            return;
        }
        const ordenados = [...rolesDelAnio].sort((a, b) => a.anio - b.anio || a.id_rol_anual - b.id_rol_anual);
        const actual = ordenados.findIndex((r) => String(r.anio) === form.rol1 && String(r.id_rol_anual) === form.rol2);
        const proximo = actual < 0 ? undefined : ordenados[actual + 1];
        if (!proximo) {
            window.alert(`No existe en el Catálogo de Roles en el Año un rol posterior al ${rol}.`);
            return;
        }
        if (window.confirm(`El rol vigente ya fué rolado, a parir de este momento los cambios se guardarán en el Rol ${proximo.id_rol_anual} ¿Desea respaldar?`)) setSiguiente(proximo);
    };

    return (
        <CatalogoLayout
            tabLabel="Respalda Rol Vigente"
            hideTabs
            statusLabel="Respaldo Base de Datos"
            count={rows.reduce((total, r) => total + r.conta, 0)}
            reportButton="Grava Rol Vigente"
            onReportButton={respalda}
            actions={busqueda.boton}
            overlay={busqueda.overlay}
            fields={
                <div className="stc-manual-fields">
                    <fieldset className="stc-campos-titulado">
                        <legend className="stc-report-options-title">Respalda el Rol Vigente</legend>
                        <div className="stc-campos-outline">
                            <div className="stc-field-group">{ROL_FIELDS.map(field)}</div>
                            {FIELDS.map(field)}
                        </div>
                    </fieldset>
                    <ProgressBar value={0} />
                </div>
            }
        >
            <DataTable title="Roles Respaldados en el Historico" className="stc-table-rol stc-table-fit" rowHeader={2} columns={COLUMNS} rows={busqueda.filtradas} />
        </CatalogoLayout>
    );
}
