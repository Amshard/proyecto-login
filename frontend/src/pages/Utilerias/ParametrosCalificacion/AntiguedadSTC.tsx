import { antiguedadStcApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function AntiguedadSTC() {
    return (
        <ParametroPage
            api={antiguedadStcApi}
            tabLabel="Antigüedad STC"
            statusLabel="Antigüedad en el STC"
            claveLabel="Años"
            claveHeader="Años Cumplidos"
            describe="años cumplidos"
            tableTitle="Antigüedad 15%"
            footerTitle="RptAntiguedadSTC"
        />
    );
}
