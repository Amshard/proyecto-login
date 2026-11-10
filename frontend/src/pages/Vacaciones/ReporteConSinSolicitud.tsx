import ProgramaPage from './ProgramaPage';
import { VER_REPORTE } from './vacacionesFields';

export default function ReporteConSinSolicitud() {
    return (
        <ProgramaPage
            tabLabel="REPORTE DE VACACIONES CON O SIN SOLICITUD"
            statusLabel="Reporte de Captura Con o Sin Solicitud"
            opcion="Imprime Solicitudes con Sol o Sin Solicitud"
            count={0}
            prejubilados
            actions={VER_REPORTE}
        />
    );
}
