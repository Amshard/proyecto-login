import ReportePage from './ReportePage';

export default function Calificaciones() {
    return (
        <ReportePage
            tabLabel="CALIFICACIONES"
            statusLabel="Reporte de Calificaciones"
            titulo="Emisión de Calificaciones"
            subtitulo="Personal de Taquilla"
            opciones={['General', 'Por Permanencia']}
        />
    );
}
