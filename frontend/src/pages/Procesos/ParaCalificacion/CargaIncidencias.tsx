import { useEffect, useRef, useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';

const TIPOS = ['Faltas Retardos', 'Faltantes y Frecuencia', 'Sanciones'];

// Header column slots, top to bottom: the three file buttons, then Limpiar.
const BUTTON_TOP = 220;
const BUTTON_STEP = 65;

const SIN_ARCHIVO = 'No se seleccionó ningún archivo';

export default function CargaIncidencias() {
    const [archivos, setArchivos] = useState<Record<string, File>>({});
    const [archivo, setArchivo] = useState('');
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const tipoRef = useRef('');

    // React has no prop for the file picker's `cancel` event (closed without choosing a file).
    useEffect(() => {
        const input = fileInputRef.current;
        if (!input) return;
        const onCancel = () => setArchivo(SIN_ARCHIVO);
        input.addEventListener('cancel', onCancel);
        return () => input.removeEventListener('cancel', onCancel);
    }, []);

    const elegir = (tipo: string) => {
        tipoRef.current = tipo;
        fileInputRef.current?.click();
    };

    const limpiar = () => {
        setArchivos({});
        setArchivo('');
        setProgress(0);
    };

    return (
        <CatalogoLayout
            tabLabel="CARGA INCIDENCIAS"
            hideTabs
            statusLabel="Carga Incidencias desde Archivos (Excel)"
            actions={
                <>
                    {TIPOS.map((tipo, i) => (
                        <button
                            key={tipo}
                            type="button"
                            className={`stc-btn stc-exit-btn stc-carga-btn${archivos[tipo] ? ' stc-carga-btn-loaded' : ''}`}
                            style={{ top: BUTTON_TOP + i * BUTTON_STEP }}
                            onClick={() => elegir(tipo)}
                        >
                            {tipo}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="stc-btn stc-exit-btn stc-carga-btn"
                        style={{ top: BUTTON_TOP + TIPOS.length * BUTTON_STEP }}
                        onClick={limpiar}
                    >
                        Limpiar
                    </button>
                </>
            }
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) {
                        setArchivo(SIN_ARCHIVO);
                        return;
                    }
                    const tipo = tipoRef.current;
                    setArchivos((prev) => ({ ...prev, [tipo]: file }));
                    setArchivo(`${tipo}: ${file.name}`);
                }}
            />
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide">
                <legend className="stc-report-options-title">Carga y/o Reemplaza Incidencias</legend>
                <div className="stc-manual-field stc-proceso-field">
                    <input
                        id="carga-archivo"
                        aria-label="Archivo"
                        className={`stc-field-input${archivo === SIN_ARCHIVO ? ' stc-field-input-sin-archivo' : ''}`}
                        value={archivo}
                        readOnly
                    />
                </div>
                <ProgressBar value={progress} />
            </fieldset>
        </CatalogoLayout>
    );
}
