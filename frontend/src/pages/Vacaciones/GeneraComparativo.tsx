import ProgramaPage from './ProgramaPage';

export default function GeneraComparativo() {
    return (
        <ProgramaPage
            tabLabel="GENERA COMPARATIVO"
            statusLabel="Comparacion de Solicitudes"
            opcion="Genera Comparativo"
            sinCampos
            count={0}
            anio
            titulo="Genera Comparativo de Solicitudes"
        />
    );
}
