import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import ProcesoOption from './ProcesoOption';
import ProgressBar from './ProgressBar';
import './Procesos.css';
import { useAlignButton } from './useAlignButton';

const PREPARA = 'Prepara el Proximo ROL';
const REGRESA = 'Regresa al ROL Anterior';

export default function RolDescansos() {
    const [option, setOption] = useState('');
    const [progress] = useState(0);
    const showRol = option === PREPARA;
    const { targetRef, buttonRef } = useAlignButton(showRol);

    return (
        <CatalogoLayout
            tabLabel="ROL DEL PERSONAL DE TAQUILLA"
            statusLabel="Rolamiento del personal de taquilla"
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
            actions={
                showRol && (
                    <button ref={buttonRef} type="button" className="stc-btn stc-exit-btn stc-rol-btn">
                        Rol
                    </button>
                )
            }
        >
            <ProcesoOption
                title="Rola el personal de Taquilla"
                label={PREPARA}
                checked={showRol}
                onCheck={() => setOption(PREPARA)}
                inputRef={targetRef}
            />
            <ProgressBar value={progress} />
        </CatalogoLayout>
    );
}
