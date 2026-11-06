import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { SideButtons } from './ProcesoControls';
import ProcesoOption from './ProcesoOption';
import ProgressBar from './ProgressBar';
import './Procesos.css';

const PREPARA = 'Prepara el Proximo ROL';
const REGRESA = 'Regresa al ROL Anterior';

export default function RolDescansos() {
    const [option, setOption] = useState('');
    const showRol = option === PREPARA;

    return (
        <CatalogoLayout
            tabLabel="ROL DEL PERSONAL DE TAQUILLA"
            statusLabel="Rolamiento del personal de Taquilla"
            count={0}
            countOnAllTabs
            onTabChange={() => setOption('')}
            extraTabs={[
                {
                    label: 'REGRESA EL ROL ANTERIOR',
                    content: (
                        <ProcesoOption
                            label={REGRESA}
                            checked={option === REGRESA}
                            onCheck={() => setOption(REGRESA)}
                            disabled
                        />
                    ),
                },
            ]}
            actions={showRol && <SideButtons buttons={[{ label: 'Rol' }]} />}
        >
            <ProcesoOption
                title="Rola el personal de Taquilla"
                label={PREPARA}
                checked={showRol}
                onCheck={() => setOption(PREPARA)}
            />
            <ProgressBar value={0} />
        </CatalogoLayout>
    );
}
