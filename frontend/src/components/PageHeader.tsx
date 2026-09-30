import type { KeyboardEventHandler, ReactNode } from 'react';

interface PageHeaderProps {
    // Buttons shown in the column on the left of the page.
    children?: ReactNode;
    onKeyDown?: KeyboardEventHandler<HTMLElement>;
}

export default function PageHeader({ children, onKeyDown }: PageHeaderProps) {
    return (
        <header className="stc-header" onKeyDown={onKeyDown}>
            {children}
            <div className="stc-header-accent" />
            <div className="stc-header-text">
                COORDINACIÓN DE TAQUILLA
                <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
            </div>
        </header>
    );
}
