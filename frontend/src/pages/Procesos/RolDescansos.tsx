import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import './Procesos.css';

const PREPARA = 'Prepara el Proximo ROL';
const REGRESA = 'Regresa al ROL Anterior';

interface RolOptionProps {
    title: string;
    label: string;
    checked: boolean;
    onCheck: () => void;
    inputRef?: Ref<HTMLInputElement>;
}

function RolOption({ title, label, checked, onCheck, inputRef }: RolOptionProps) {
    return (
        <fieldset className="stc-report-options stc-rol-options">
            <legend className="stc-report-options-title">{title}</legend>
            <label className="stc-report-option">
                <input ref={inputRef} type="radio" checked={checked} onChange={onCheck} />
                {label}
            </label>
        </fieldset>
    );
}

export default function RolDescansos() {
    const [option, setOption] = useState('');
    const radioRef = useRef<HTMLInputElement>(null);
    const rolButtonRef = useRef<HTMLButtonElement>(null);
    const showRol = option === PREPARA;

    useLayoutEffect(() => {
        const button = rolButtonRef.current;
        const radio = radioRef.current;
        if (!showRol || !button || !radio) return;
        const align = () => {
            const box = radio.getBoundingClientRect();
            const parentTop = button.offsetParent?.getBoundingClientRect().top ?? 0;
            button.style.top = `${box.top + box.height / 2 - parentTop}px`;
        };
        align();
        const observer = new ResizeObserver(align);
        observer.observe(document.body);
        window.addEventListener('resize', align);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', align);
        };
    }, [showRol]);

    return (
        <CatalogoLayout
            tabLabel="ROL DEL PERSONAL DE TAQUILLA"
            statusLabel="Rolamiento del personal de taquilla"
            onTabChange={() => setOption('')}
            secondTab={{
                label: 'REGRESA EL ROL ANTERIOR',
                content: (
                    <RolOption
                        title="Regresa el ROL Anterior"
                        label={REGRESA}
                        checked={option === REGRESA}
                        onCheck={() => setOption(REGRESA)}
                    />
                ),
            }}
            actions={
                showRol && (
                    <button ref={rolButtonRef} type="button" className="stc-btn stc-exit-btn stc-rol-btn">
                        Rol
                    </button>
                )
            }
        >
            <RolOption
                title="Rola el personal de Taquilla"
                label={PREPARA}
                checked={showRol}
                onCheck={() => setOption(PREPARA)}
                inputRef={radioRef}
            />
        </CatalogoLayout>
    );
}
