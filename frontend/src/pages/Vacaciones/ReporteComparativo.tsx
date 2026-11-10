import ProgramaPage from './ProgramaPage';
import { VER_REPORTE } from './vacacionesFields';

export default function ReporteComparativo() {
    return (
        <ProgramaPage
            tabLabel="REPORTE COMPARATIVO DE VACACIONES ASIGNADAS"
            statusLabel="Comparación de Solicitudes"
            opcion="Reporte Comparativo de Solicitudes de Vacaciones"
            sinCampos
            titulo="Reporte Comparativo de Solicitudes"
            count={0}
            anio
            actions={VER_REPORTE}
        />
    );
}
