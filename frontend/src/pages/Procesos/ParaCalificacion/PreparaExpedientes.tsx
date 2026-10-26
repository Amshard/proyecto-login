import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import ProcesoOption from '../ProcesoOption';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';
import { useAlignButton } from '../useAlignButton';

const PREPARA = 'Prepara Expedientes';

export default function PreparaExpedientes() {
    const [checked, setChecked] = useState(false);
    const [progress] = useState(0);
    const { targetRef, buttonRef } = useAlignButton(checked);

    return (
        <CatalogoLayout
            tabLabel="PREPARA EXPEDIENTES"
            hideTabs
            statusLabel="Prepara Expedientes (Para Asignar Incidencias)"
            actions={
                checked && (
                    <button ref={buttonRef} type="button" className="stc-btn stc-exit-btn stc-rol-btn">
                        Prepara
                    </button>
                )
            }
        >
            <ProcesoOption
                wide
                label={PREPARA}
                checked={checked}
                onCheck={() => setChecked(true)}
                inputRef={targetRef}
            >
                <ProgressBar value={progress} />
            </ProcesoOption>
        </CatalogoLayout>
    );
}
