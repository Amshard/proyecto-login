import ReportePage from './ReportePage';

export default function CategoriasTaquilla() {
    return (
        <ReportePage
            tabLabel="CATEGORÍAS EN TAQUILLA"
            statusLabel="Reporte de Categorías"
            titulo="Emisión de Categorías"
            subtitulo="Totales"
            opciones={['Por Línea y Turno', 'General por Categoría (Alfabético)']}
        />
    );
}
