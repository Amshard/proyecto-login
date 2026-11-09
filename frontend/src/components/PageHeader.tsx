import type { KeyboardEventHandler, ReactNode } from 'react';

interface PageHeaderProps {
    children?: ReactNode;
    onKeyDown?: KeyboardEventHandler<HTMLElement>;
}

export default function PageHeader({ children, onKeyDown }: PageHeaderProps) {
    return (
        <>
            {/* Outside the header, so the header can stack above it. */}
            <div className="stc-header-accent" />
            <header className="stc-header" onKeyDown={onKeyDown}>
                {children}
                <div className="stc-header-text">
                    COORDINACIÓN DE TAQUILLA
                    <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
                </div>
            </header>
        </>
    );
}
