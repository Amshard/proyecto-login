import ProgramaPage from './ProgramaPage';

export default function GeneraSolicitudesFaltantes() {
    return (
        <ProgramaPage
            tabLabel="GENERA SOLICITUDES PARA EL PERSONAL FALTANTE"
            statusLabel="Clasifica la Captura Con o Sin solicitud"
            opcion="Agrega Solicitud Faltantes"
            count={0}
            prejubilados
        />
    );
}
