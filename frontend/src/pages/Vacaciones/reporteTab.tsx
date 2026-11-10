export const reporteTab = (titulo: string, onGenerar: () => void) => ({
    label: 'Reporte',
    content: (
        <div className="stc-report-panel">
            <fieldset className="stc-report-options stc-report-frame">
                <legend className="stc-report-options-title">{titulo}</legend>
                <button type="button" className="stc-btn stc-generar-reporte-btn" onClick={onGenerar}>
                    Generar Reporte
                </button>
            </fieldset>
        </div>
    ),
});
