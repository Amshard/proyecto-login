import { antiguedadStcApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function AntiguedadSTC() {
    return (
        <ParametroPage
            api={antiguedadStcApi}
            tabLabel="Antigüedad STC"
            statusLabel="Antigüedad en el STC"
            claveLabel="Años Cumplidos"
            claveHeader="Años"
            describe="años cumplidos"
            tableTitle="Antigüedad 15%"
            footerTitle="RptAntiguedadSTC"
        />
    );
}
