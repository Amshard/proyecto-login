import { useEffect, useRef } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import '../Procesos.css';

const CONFIRMA =
    'Si ya realizó la preparación de Expedientes y ya cargo los archivos de:\n' +
    'Faltantes de Efectivo, Faltas y retardos y Sanciones\n' +
    '¿Quiere continuar?';

export default function AsignacionIncidencias() {
    const asked = useRef(false);

    useEffect(() => {
        if (asked.current) return;
        asked.current = true;
        if (!window.confirm(CONFIRMA)) window.alert('Se cancela la asignación');
    }, []);

    return (
        <CatalogoLayout
            tabLabel="ASIGNACIÓN DE INCIDENCIAS"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Asignación de Incidencias"
        >
            {null}
        </CatalogoLayout>
    );
}
