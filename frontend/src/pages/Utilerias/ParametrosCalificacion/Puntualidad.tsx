import { puntualidadApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function Puntualidad() {
    return (
        <ParametroPage
            api={puntualidadApi}
            tabLabel="Puntualidad"
            statusLabel="Puntualidad"
            claveLabel="Retardos"
            claveHeader="Retardos"
            describe="retardos"
            tableTitle="Puntualidad 20%"
            footerTitle="RptPuntualidad"
        />
    );
}
