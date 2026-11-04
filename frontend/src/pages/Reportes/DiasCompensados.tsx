import ProgressBar from '../Procesos/ProgressBar';
import ReportePage from './ReportePage';

export default function DiasCompensados() {
    return (
        <ReportePage
            tabLabel="DÍAS COMPENSADOS"
            statusLabel="Descansos Anteriores y nuevos Rol Vigente"
            titulo="Carga Descansos y Reporte de Dias Compensados"
            opciones={['Carga Descansos anteriores y Descansos del Rol Vigente', 'Reporte de Dias de Compensacion']}
        >
            <ProgressBar value={0} />
        </ReportePage>
    );
}
