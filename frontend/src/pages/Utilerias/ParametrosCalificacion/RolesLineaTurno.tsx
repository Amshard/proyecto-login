import { rolesLineaTurnoApi } from '../../../api/catalogos';
import ParametroPage from './ParametroPage';

export default function RolesLineaTurno() {
    return (
        <ParametroPage
            api={rolesLineaTurnoApi}
            tabLabel="Roles en la Línea y en el Turno"
            statusLabel="Roles en la Línea y en el Turno"
            claveLabel="Roles"
            claveHeader="Roles"
            describe="roles"
            tableTitle={['Antigüedad en la Línea 10%', 'Antigüedad en el Turno 10%']}
            footerTitle="RptRolesLineaTurno"
        />
    );
}
