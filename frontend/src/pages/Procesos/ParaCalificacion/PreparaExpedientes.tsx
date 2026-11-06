import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import { SideButtons } from '../ProcesoControls';
import ProcesoOption from '../ProcesoOption';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';

export default function PreparaExpedientes() {
    const [checked, setChecked] = useState(false);

    return (
        <CatalogoLayout
            tabLabel="PREPARA EXPEDIENTES"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Prepara Expedientes"
            count={0}
            actions={checked && <SideButtons buttons={[{ label: 'Prepara' }]} />}
        >
            <ProcesoOption wide label="Prepara Expedientes" checked={checked} onCheck={() => setChecked(true)}>
                <ProgressBar value={0} />
            </ProcesoOption>
        </CatalogoLayout>
    );
}
