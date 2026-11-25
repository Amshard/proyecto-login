import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import { useLugaresOcupados } from '../useLugaresOcupados';
import PorcentajesCalificacion from './PorcentajesCalificacion';

export default function ActualizaIncidencias() {
    const [vacio, setVacio] = useState(0);
    const [ocupados] = useLugaresOcupados();

    const guardar = () => {};

    return (
        <CatalogoLayout
            tabLabel="ACTUALIZA INCIDENCIAS"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Actualiza Incidencias X Expediente"
            count={ocupados}
            onClear={() => setVacio((n) => n + 1)}
            onSave={guardar}
        >
            <PorcentajesCalificacion key={vacio} titulo="ALTA O MODIFICACION DE INCIDENCIAS POR EXPEDIENTE" />
        </CatalogoLayout>
    );
}
