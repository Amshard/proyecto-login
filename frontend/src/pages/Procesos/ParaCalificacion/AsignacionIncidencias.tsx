import { useEffect, useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import { RadioOptions, SideButtons } from '../ProcesoControls';
import '../Procesos.css';

const CONFIRMA =
    'Si ya realizó la preparación de Expedientes y ya cargo los archivos de:\n' +
    'Faltantes de Efectivo, Faltas y retardos y Sanciones\n' +
    '¿Quiere continuar?';

const INCIDENCIAS = ['Faltante de Efectivo y Frecuencia', 'Faltas y Retardos', 'Sanciones'];
const SETS = [
    { titulo: 'Asignación', options: INCIDENCIAS },
    { titulo: 'Reportes', options: INCIDENCIAS },
];

export default function AsignacionIncidencias() {
    const [confirmado, setConfirmado] = useState(false);
    const [opciones, setOpciones] = useState(() => SETS.map(() => ''));

    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.confirm(CONFIRMA)) setConfirmado(true);
            else window.alert('Se cancela la asignación');
        });
        return () => clearTimeout(timer);
    }, []);

    return (
        <CatalogoLayout
            tabLabel="ASIGNACIÓN DE INCIDENCIAS"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Asignación de Incidencias"
            actions={confirmado && <SideButtons buttons={[{ label: 'Asignación' }, { label: 'Reporte' }]} />}
        >
            {confirmado && (
                <div className="stc-asignacion-sets stc-asignacion-outline">
                    <h2 className="stc-asignacion-titulo">Incidencias</h2>
                    {SETS.map(({ titulo, options }, i) => (
                        <fieldset key={titulo} className="stc-report-options stc-asignacion-set">
                            <legend className="stc-report-options-title">{titulo}</legend>
                            <RadioOptions
                                options={options}
                                value={opciones[i]}
                                onChange={(value) => setOpciones((prev) => prev.map((v, j) => (j === i ? value : v)))}
                            />
                        </fieldset>
                    ))}
                </div>
            )}
        </CatalogoLayout>
    );
}
