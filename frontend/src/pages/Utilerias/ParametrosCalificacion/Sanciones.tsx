import { sancionesApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function Sanciones() {
    return (
        <ParametroPage
            api={sancionesApi}
            tabLabel="Sanciones"
            statusLabel="Sanciones"
            claveLabel="Sanciones"
            claveHeader="Sanciones"
            describe="sanciones"
            tableTitle="Sanciones 5%"
            nota="Amonestaciones, Notas de Demérito o Suspensiones"
            footerTitle="RptSanciones"
        />
    );
}
