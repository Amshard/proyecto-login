import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import DataTable, { type Column } from '../../../components/DataTable';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';

const HEADERS = ['Reg', 'Exp', 'Nombre', 'Lin', 'Tur', 'Lin', 'Tur', 'Tot-Lin', 'Tot-Tur'];

// Headers only: the table is not linked to any data yet, so it stays empty.
const COLUMNS: Column<never>[] = HEADERS.map((header) => ({ header, cell: () => null, center: true }));

type RangoKey = 'exp_ini' | 'exp_fin' | 'rol_ini' | 'anio_ini' | 'rol_fin' | 'anio_fin';

// Each set has one title over its numbers-only boxes; `digitos` is each box's max length.
const RANGOS: { titulo: string; cajas: { key: RangoKey; label: string; digitos: number }[] }[] = [
    {
        titulo: 'Expediente Inicial y Final',
        cajas: [
            { key: 'exp_ini', label: 'Expediente Inicial', digitos: 5 },
            { key: 'exp_fin', label: 'Expediente Final', digitos: 5 },
        ],
    },
    {
        titulo: 'Rol y Año Inicial',
        cajas: [
            { key: 'rol_ini', label: 'Rol Inicial', digitos: 1 },
            { key: 'anio_ini', label: 'Año Inicial', digitos: 4 },
        ],
    },
    {
        titulo: 'Rol y Año Final',
        cajas: [
            { key: 'rol_fin', label: 'Rol Final', digitos: 1 },
            { key: 'anio_fin', label: 'Año Final', digitos: 4 },
        ],
    },
];

const EMPTY_RANGO: Record<RangoKey, string> = { exp_ini: '', exp_fin: '', rol_ini: '', anio_ini: '', rol_fin: '', anio_fin: '' };

// Second row: two lines, each a single-digit Rol box and two date boxes.
const LINEAS = [0, 1];
const EMPTY_LINEAS = LINEAS.map(() => ({ rol: '', fechas: ['', ''] }));

// About 1ch per digit, plus room for the padding and border.
const digitWidth = (digitos: number) => ({ width: `calc(${digitos}ch + 26px)` });

// Header column slots, top to bottom. A bit more room than other pages: the long labels wrap to several lines.
const BUTTON_TOP = 220;
const BUTTON_STEP = 70;

export default function ActualizaCalificacion() {
    const rows: never[] = [];
    const [rango, setRango] = useState(EMPTY_RANGO);
    const [lineas, setLineas] = useState(EMPTY_LINEAS);
    const [progress, setProgress] = useState(0);

    const setRol = (linea: number, rol: string) =>
        setLineas((prev) => prev.map((l, i) => (i === linea ? { ...l, rol } : l)));
    const setFecha = (linea: number, caja: number, fecha: string) =>
        setLineas((prev) =>
            prev.map((l, i) => (i === linea ? { ...l, fechas: l.fechas.map((f, j) => (j === caja ? fecha : f)) } : l))
        );

    const limpiar = () => {
        setRango(EMPTY_RANGO);
        setLineas(EMPTY_LINEAS);
        setProgress(0);
    };

    // Only Limpiar has an action yet.
    const buttons = [
        { label: 'Ver Concentrado', onClick: undefined },
        { label: 'Limpiar', onClick: limpiar },
        { label: 'Genera en Excel', onClick: undefined },
        { label: 'Ver Reporte', onClick: undefined },
        { label: 'Actualiza Calificacion x Expediente', onClick: undefined },
    ];

    return (
        <CatalogoLayout
            tabLabel="TECLEA EL RANGO"
            statusLabel="Lineas y Turnos por Expediente Completo"
            actions={
                <>
                    {buttons.map(({ label, onClick }, i) => (
                        <button
                            key={label}
                            type="button"
                            className="stc-btn stc-exit-btn stc-carga-btn"
                            style={{ top: BUTTON_TOP + i * BUTTON_STEP }}
                            onClick={onClick}
                        >
                            {label}
                        </button>
                    ))}
                    {/* In the spot the Registros box takes on other pages. */}
                    <div className="stc-header-registros stc-actualiza-header-text">MUESTRA INFORMACION DE LOS ROLES</div>
                </>
            }
            fields={
                <>
                    <div className="stc-manual-fields">
                        {RANGOS.map(({ titulo, cajas }) => (
                            <div key={titulo} className="stc-manual-field stc-rango-set">
                                <span className="stc-field-label">{titulo}</span>
                                <div className="stc-rango-cajas">
                                    {cajas.map(({ key, label, digitos }) => (
                                        <input
                                            key={key}
                                            className="stc-field-input"
                                            aria-label={label}
                                            inputMode="numeric"
                                            maxLength={digitos}
                                            style={digitWidth(digitos)}
                                            value={rango[key]}
                                            onChange={(e) => setRango((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, '') }))}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="stc-manual-fields stc-rango-lineas">
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Rol</span>
                            <div className="stc-rango-columna">
                                {lineas.map(({ rol }, linea) => (
                                    <input
                                        key={linea}
                                        className="stc-field-input"
                                        aria-label={`Rol ${linea + 1}`}
                                        inputMode="numeric"
                                        maxLength={1}
                                        style={digitWidth(1)}
                                        value={rol}
                                        onChange={(e) => setRol(linea, e.target.value.replace(/\D/g, ''))}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Fechas</span>
                            <div className="stc-rango-columna">
                                {lineas.map(({ fechas }, linea) => (
                                    <div key={linea} className="stc-rango-cajas">
                                        {fechas.map((fecha, caja) => (
                                            <input
                                                key={caja}
                                                type="date"
                                                className="stc-field-input stc-rango-fecha"
                                                aria-label={`Fecha ${caja + 1} del Rol ${linea + 1}`}
                                                value={fecha}
                                                onChange={(e) => setFecha(linea, caja, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ProgressBar value={progress} />
                    </div>
                </>
            }
        >
            <DataTable title="Calificaciones por Cambio de Línea y Turno" className="stc-table-actualiza" rowHeader columns={COLUMNS} rows={rows} />
        </CatalogoLayout>
    );
}
