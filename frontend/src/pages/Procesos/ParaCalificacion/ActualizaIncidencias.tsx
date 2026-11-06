import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import PorcentajesCalificacion from './PorcentajesCalificacion';

export default function ActualizaIncidencias() {
    const [vacio, setVacio] = useState(0);

    const guardar = () => {};

    return (
        <CatalogoLayout
            tabLabel="ACTUALIZA INCIDENCIAS"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Actualiza Incidencias X Expediente"
            count={0}
            onClear={() => setVacio((n) => n + 1)}
            onSave={guardar}
        >
            <PorcentajesCalificacion key={vacio} titulo="ALTA O MODIFICACION DE INCIDENCIAS POR EXPEDIENTE" />
        </CatalogoLayout>
    );
}
