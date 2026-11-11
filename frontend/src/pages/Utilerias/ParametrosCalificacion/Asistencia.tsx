import { asistenciaApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function Asistencia() {
    return (
        <ParametroPage
            api={asistenciaApi}
            tabLabel="Asistencia"
            statusLabel="Asistencia"
            claveLabel="Faltas"
            claveHeader="Faltas"
            describe="faltas"
            tableTitle="Asistencia 30%"
            footerTitle="RptAsistencia"
        />
    );
}
