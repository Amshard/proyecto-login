import { frecuenciaFeApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function FrecuenciaFE() {
    return (
        <ParametroPage
            api={frecuenciaFeApi}
            tabLabel="Frecuencia FE"
            statusLabel="Frecuencia de Faltante de Efectivo"
            claveLabel="Frecuencia"
            claveHeader="Frecuencia"
            describe="frecuencia"
            puntosEnteros
            tableTitle="Frecuencia 4%"
            footerTitle="RptFrecuenciaFE"
        />
    );
}
