interface PageHeaderProps {
    onExit: () => void;
}

export default function PageHeader({ onExit }: PageHeaderProps) {
    return (
        <header className="stc-header">
            <button type="button" className="stc-exit-btn" onClick={onExit}>
                Salir
            </button>
            <div className="stc-header-accent" />
            <div className="stc-header-text">
                COORDINACIÓN DE TAQUILLA
                <h1>SUBDIRECCION GENERAL DE ADMINISTRACION Y FINANZAS</h1>
            </div>
        </header>
    );
}
