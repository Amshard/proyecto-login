import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';
import { useAlignButton } from '../useAlignButton';

// Today as YYYY-MM-DD in local time; toISOString() would give tomorrow's date on Mexico City evenings.
const hoy = () => {
    const d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
};

export default function Califica() {
    const [fecha, setFecha] = useState(hoy);
    const [progress] = useState(0);
    const { targetRef, buttonRef } = useAlignButton(true);

    return (
        <CatalogoLayout
            tabLabel="CALIFICA"
            hideTabs
            statusLabel="Califica"
            actions={
                <button ref={buttonRef} type="button" className="stc-btn stc-exit-btn stc-rol-btn">
                    Califica
                </button>
            }
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide">
                <legend className="stc-report-options-title">La calificación es sólo valida al inicio de cada Rol.</legend>
                <fieldset className="stc-califica-fecha">
                    <legend className="stc-report-options-title">Fecha al cambio de Rol</legend>
                    <input
                        ref={targetRef}
                        type="date"
                        className="stc-field-input"
                        aria-label="Fecha al cambio de Rol"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </fieldset>
                <ProgressBar value={progress} />
            </fieldset>
        </CatalogoLayout>
    );
}
