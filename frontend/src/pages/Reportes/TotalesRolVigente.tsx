import ProgressBar from '../Procesos/ProgressBar';
import ReportePage from './ReportePage';

export default function TotalesRolVigente() {
    return (
        <ReportePage
            tabLabel="TOTALES DEL ROL VIGENTE"
            statusLabel="Reporte de Periodos x Permanencias"
            anio
            titulo="Emisión de Reportes"
            subtitulo="Reporte"
            opciones={['Carga Periodo y Permanencias del Rol Vigente', 'Reportes por Periodo y Permanencias']}
        >
            <ProgressBar value={0} />
        </ReportePage>
    );
}
