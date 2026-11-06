import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import PorcentajesCalificacion from '../Procesos/ParaCalificacion/PorcentajesCalificacion';
import { NO_ROWS, headersOnly } from '../Procesos/procesoFields';
import './Consultas.css';

const ALFABETICO_COLUMNAS = headersOnly([
    'Reg',
    'Exp', 
    'Nombre', 
    'Calif Tot', 
    'Ingresos STC',
    'Años',
    'Calif',
    'Faltas',
    'Calif',
    'Retardos',
    'Calif',
    'Falta Efect',
    'Calif',
    'Frec',
    'Calif',
    'Amonesta',
    'Notas',
    'Susp',
    'Sanción',
    'Calif',
    'CalXMer',
    'RolesLin',
    'Calif',
    'RolesTur',
    'Calif'
]);

export default function ConsultaCalificaciones() {
    const [vacio, setVacio] = useState(0);

    return (
        <CatalogoLayout
            tabLabel="CALIFICACION POR UN EXPEDIENTE"
            statusLabel="Consulta Calificaciones"
            onClear={() => setVacio((n) => n + 1)}
            extraTabs={[
                {
                    label: 'CALIFICACIONES (Alfabético)',
                    content: (
                        <DataTable title="" className="stc-table-fit stc-table-calif" rowHeader={3} columns={ALFABETICO_COLUMNAS} rows={NO_ROWS} />
                    ),
                },
            ]}
        >
            <PorcentajesCalificacion key={vacio} consulta titulo="ALTA O MODIFICACION DE INCIDENCIAS POR EXPEDIENTE" />
        </CatalogoLayout>
    );
}
