import { faltanteEfectivoApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

const MONTOS = [
    { key: 'monto_inicial', label: 'De $' },
    { key: 'monto_final', label: 'A $' },
];

export default function FaltanteEfectivo() {
    return (
        <ParametroPage
            api={faltanteEfectivoApi}
            tabLabel="Faltante de Efectivo en $"
            statusLabel="Faltante de Efectivo $"
            claveLabel="Monto"
            claveHeader="Monto"
            describe="rango"
            montos={MONTOS}
            puntosEnteros
            tableTitle="Faltante de Efectivo 6%"
            footerTitle="RptFaltanteEfectivo"
        />
    );
}
