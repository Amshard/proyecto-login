import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import { SideButtons } from '../ProcesoControls';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';

const hoy = () => {
    const d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
};

export default function Califica() {
    const [fecha, setFecha] = useState(hoy);

    return (
        <CatalogoLayout
            tabLabel="CALIFICA"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Califica Expedientes"
            count={0}
            actions={<SideButtons buttons={[{ label: 'Califica' }]} />}
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide">
                <legend className="stc-report-options-title">La calificación es sólo valida al inicio de cada Rol.</legend>
                <fieldset className="stc-califica-fecha">
                    <legend className="stc-report-options-title">Fecha al cambio de Rol</legend>
                    <input
                        type="date"
                        className="stc-field-input"
                        aria-label="Fecha al cambio de Rol"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </fieldset>
                <ProgressBar value={0} />
            </fieldset>
        </CatalogoLayout>
    );
}
