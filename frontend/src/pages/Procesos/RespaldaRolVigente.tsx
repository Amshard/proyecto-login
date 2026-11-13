import { type RolTaquilla } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import { useBusqueda } from '../../components/useBusqueda';
import { useAuth } from '../../context/useAuth';
import type { RolVigente } from '../../types/auth.types';
import { codeField, dateField, textField, texto } from '../Catalogos/useCatalogo';
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
    rol1: texto(rol?.fecha_ini).slice(0, 4),
    rol2: texto(rol?.id_rol_anual),
    rol3: texto(rol?.nombre_rol),
    fecha_inicial: texto(rol?.fecha_ini).slice(0, 10),
    fecha_final: texto(rol?.fecha_fin).slice(0, 10),
    meses_califica: texto(rol?.meses_q_califica),
    estado: rol ? (rol.estatus_roldescansos ?? 'NO Rolado') : '',
});

const COLUMNS: Column<RolTaquilla>[] = [
    { header: 'Año', cell: (r) => r.numero, center: true },
    { header: 'Rol', cell: (r) => r.id_expediente, center: true },
    { header: 'Mes Inicid', cell: (r) => r.id_tramo, center: true },
    { header: 'Fech_ini', cell: (r) => r.faltas, center: true },
    { header: 'Fech_Fin', cell: (r) => r.id_taquilla, center: true },
    { header: 'Fec_Respldo', cell: (r) => r.categoria, center: true },
    { header: 'Lugares', cell: (r) => r.id_descansos, center: true },
];

const ROWS: RolTaquilla[] = [];

export default function RespaldaRolVigente() {
    const busqueda = useBusqueda(ROWS);
    const { user } = useAuth();
    const form = rolForm(user?.rol_vigente);
    const field = (config: ManualFieldConfig<RespaldoKey>) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={() => {}} readOnly />
    );

    const respalda = async () => {};

    return (
        <CatalogoLayout
            tabLabel="Respalda Rol Vigente"
            hideTabs
            statusLabel="Respaldo Base de Datos"
            count={ROWS.length}
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
            <DataTable title="Roles Respaldados en el Historico" className="stc-table-rol stc-table-fit" rowHeader columns={COLUMNS} rows={busqueda.filtradas} />
        </CatalogoLayout>
    );
}
