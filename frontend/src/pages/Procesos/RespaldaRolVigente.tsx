import { useState } from 'react';
import {
    apiErrorMessage,
    getRolesDelAnio,
    getRolesHist,
    getRolTaquilla,
    isConflict,
    respaldaRolVigente,
    type RolHist,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import { useAuth } from '../../context/useAuth';
import type { RolVigente } from '../../types/auth.types';
import { ddmmyyyy, isoDate } from '../../utils/fechas';
import { codeField, dateField, recarga, textField, texto, useCatalogoRows } from '../Catalogos/useCatalogo';
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

const REEMPLAZO = 'El Rol Ya Fue Gravado ¿Desea Reemplazarlo?';

const pintado = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

/** Waits for the progress bar's 0.2s width transition to finish. */
const llenado = () => new Promise<void>((resolve) => setTimeout(resolve, 250));

const fecha = (value: string | null) => (value ? ddmmyyyy(value.slice(0, 10)) : '');

const COLUMNS: Column<RolHist>[] = [
    { header: 'Año', cell: (r) => r.rol_anio, center: true },
    { header: 'Rol', cell: (r) => r.rol_num, center: true },
    { header: 'Mes Inicio', cell: (r) => r.inc_cargadas, center: true },
    { header: 'Fecha Inicio', cell: (r) => fecha(r.fec_ini_rol), center: true },
    { header: 'Fecha Fin', cell: (r) => fecha(r.fec_fin_rol), center: true },
    { header: 'Fecha Respaldo', cell: (r) => fecha(r.fecha_respaldo), center: true },
    { header: 'Lugares', cell: (r) => r.conta, center: true },
];

export default function RespaldaRolVigente() {
    const [rows, , recargaRows] = useCatalogoRows(getRolesHist);
    const [rolesDelAnio, , recargaRolesDelAnio] = useCatalogoRows(getRolesDelAnio);
    const [rolTaquilla, , recargaRolTaquilla] = useCatalogoRows(getRolTaquilla);
    const [siguiente, setSiguiente] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const { user, refreshUser } = useAuth();
    const vigente = rolForm(user?.rol_vigente);
    const rolado = vigente.estado === 'ROLADO';
    const anio = Number(vigente.rol1);
    const num = Number(vigente.rol2);
    const [anioSig, numSig] = num >= 4 ? [anio + 1, 1] : [anio, num + 1];
    const encontrado = rolesDelAnio.find((r) => r.anio === anioSig && r.id_rol_anual === numSig);
    const proximo = encontrado && numSig === 1 ? { ...encontrado, estado: 'ROLADO' } : encontrado;
    const form = !siguiente
        ? vigente
        : proximo
          ? rolForm({ ...proximo, estatus_roldescansos: proximo.estado })
          : { ...rolForm(null), rol1: String(anioSig), rol2: String(numSig), estado: 'NO ROLADO' };
    const field = (config: ManualFieldConfig<RespaldoKey>) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={() => {}} readOnly />
    );

    const actualiza = () => {
        setSiguiente(false);
        setProgreso(0);
        recarga(recargaRows, recargaRolTaquilla, recargaRolesDelAnio, refreshUser)();
    };

    const siguienteDeAlta = !!proximo && texto(proximo.estado).trim().toUpperCase() === 'ROLADO';
    const rol = `${vigente.rol1} Rol ${vigente.rol2}`;
    const respaldos = rows.filter((r) => r.rol_anio === anio && r.rol_num === num);
    const existe = respaldos.length > 0;
    const reciente = respaldos.some((r) => texto(r.fecha_respaldo).slice(0, 10) === isoDate());

    const respalda = async () => {
        const faltan = [
            ['Año', vigente.rol1],
            ['Rol', vigente.rol2],
            ['Fecha Inicial', vigente.fecha_inicial],
            ['Fecha Final', vigente.fecha_final],
        ].filter(([, valor]) => !valor.trim());
        if (faltan.length > 0) {
            window.alert(`Falta Seleccionar ${faltan.map(([campo]) => campo).join(', ')} del Rol.`);
            return;
        }
        if (!rolado) {
            window.alert(`El Rol Vigente ${rol} no está ROLADO.`);
            return;
        }
        // Respaldo reciente (de hoy): primer Grava muestra el Rol Siguiente, el segundo pregunta si reemplazar.
        if (reciente) {
            if (!siguiente) {
                if (window.confirm(`El rol vigente ya fué rolado, a parir de este momento los cambios se guardarán en el Rol ${numSig} ¿Desea respaldar?`)) {
                    setSiguiente(true);
                }
                return;
            }
            if (window.confirm(REEMPLAZO)) await guarda(true);
            return;
        }
        // Sin respaldo, o con uno anterior: pregunta y guarda en un solo Grava.
        const pregunta = existe
            ? REEMPLAZO
            : `El Rol Vigente ya fue rolado, a pertir de este momento los cambios se guardaran en el Rol ${numSig} ¿Desea respaldar?`;
        if (window.confirm(pregunta)) await guarda(existe);
    };

    const guarda = async (reemplaza: boolean) => {
        setSiguiente(true);
        await pintado();
        if (!siguienteDeAlta) {
            window.alert('No esta dado de alta el ROL Siguiente');
            return;
        }
        const datos = {
            anio,
            rol_num: num,
            fecha_ini: vigente.fecha_inicial,
            fecha_fin: vigente.fecha_final,
            inc_cargadas: vigente.meses_califica,
            reemplaza,
        };
        // The server answers in one request, so the bar creeps toward 90% while it works and fills on success.
        setProgreso(0);
        const avance = window.setInterval(() => setProgreso((p) => p + (90 - p) * 0.1), 100);
        const termina = (valor: number) => {
            window.clearInterval(avance);
            setProgreso(valor);
        };
        let respaldados: number;
        try {
            try {
                respaldados = await respaldaRolVigente(datos);
            } catch (error) {
                if (!isConflict(error)) throw error;
                if (!window.confirm(REEMPLAZO)) {
                    termina(0);
                    return;
                }
                respaldados = await respaldaRolVigente({ ...datos, reemplaza: true });
            }
        } catch (error) {
            termina(0);
            window.alert(apiErrorMessage(error, 'No se pudo respaldar el Rol Vigente.'));
            return;
        }
        termina(100);
        await llenado();
        window.alert(`Se respaldaron ${respaldados} lugares del Rol.`);
        recarga(recargaRows, recargaRolTaquilla)();
    };

    return (
        <CatalogoLayout
            tabLabel="Respalda Rol Vigente"
            hideTabs
            statusLabel="Respaldo Base de Datos"
            count={rolTaquilla.filter((r) => r.id_expediente > 0).length}
            reportButton="Grava Rol Vigente"
            onReportButton={respalda}
            onActualizar={actualiza}
            fields={
                <div className="stc-manual-fields">
                    <fieldset className="stc-campos-titulado">
                        <legend className="stc-report-options-title">Respalda el Rol Vigente</legend>
                        <div className="stc-campos-outline">
                            <div className="stc-field-group">{ROL_FIELDS.map(field)}</div>
                            {FIELDS.map(field)}
                        </div>
                    </fieldset>
                    <ProgressBar value={progreso} />
                </div>
            }
        >
            <DataTable title="Roles Respaldados en el Historico" className="stc-table-rol stc-table-fit" rowHeader={2} columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
