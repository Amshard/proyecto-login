import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import DataTable, { type Column } from '../../../components/DataTable';
import { ManualField } from '../../../components/ManualField';
import { codeField } from '../../Catalogos/useCatalogo';
import ProgressBar from '../ProgressBar';
import '../Procesos.css';

const ANIO_FIELD = codeField('anio', 'Proporcione Año actual', 4, { width: 60, wrap: 160, numeric: true });

interface RolHistorico {
    anio: number;
    rol: number;
    incidencias: number | null;
    fec_ini_rol: string | null;
    fec_fin_rol: string | null;
    fec_respaldo: string | null;
    lugares_rol: number | null;
}

const COLUMNS: Column<RolHistorico>[] = [
    { header: 'Año', cell: (r) => r.anio, center: true },
    { header: 'Rol', cell: (r) => r.rol, center: true },
    { header: 'Incidencias', cell: (r) => r.incidencias, center: true },
    { header: 'Fec_Ini_Rol', cell: (r) => r.fec_ini_rol, center: true },
    { header: 'Fec_Fin_Rol', cell: (r) => r.fec_fin_rol, center: true },
    { header: 'Fec_Respaldo', cell: (r) => r.fec_respaldo, center: true },
    { header: 'Lugares_Rol', cell: (r) => r.lugares_rol, center: true },
];

const ROLES = ['Primer Rol', 'Segundo Rol', 'Tercer Rol', 'Cuarto Rol'];
// Digits allowed in each line's two boxes.
const BOX_DIGITS = [1, 4];

const emptyRoles = () => ROLES.map(() => ['', '']);

// Header column slots, top to bottom.
const BUTTON_TOP = 220;
const BUTTON_STEP = 65;

export default function RolesTurnoLinea() {
    const rows: RolHistorico[] = [];
    const [anioActual] = useState(() => String(new Date().getFullYear()));
    const [anio, setAnio] = useState(anioActual);
    // Green while the box holds the current year.
    const anioField =
        anio === anioActual ? { ...ANIO_FIELD, inputStyle: { ...ANIO_FIELD.inputStyle, background: '#9be79b' } } : ANIO_FIELD;
    const [progress, setProgress] = useState(0);
    // Two boxes per rol line.
    const [roles, setRoles] = useState(emptyRoles);

    const setRol = (line: number, box: number, value: string) =>
        setRoles((prev) => prev.map((pair, i) => (i === line ? pair.map((v, j) => (j === box ? value : v)) : pair)));

    const limpia = () => {
        setRoles(emptyRoles());
        setProgress(0);
    };

    // Busca and Prepara Rol have no action yet.
    const buttons = [
        { label: 'Busca', onClick: undefined },
        { label: 'Limpia', onClick: limpia },
        { label: 'Prepara Rol', onClick: undefined },
    ];

    return (
        <CatalogoLayout
            tabLabel="ROLES POR TURNO Y LÍNEA"
            hideTabs
            statusLabel="Roles por Turno y Línea (Promedia Calificación)"
            actions={buttons.map(({ label, onClick }, i) => (
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
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide stc-roles-options">
                <legend className="stc-report-options-title">Prepara Concentrado por Turno y Lines</legend>
                <div className="stc-roles-anio">
                    <div className="stc-roles-labels">
                        <span className="stc-roles-text stc-roles-lines-label">Seleccione Primer Rol</span>
                        <span className="stc-roles-text stc-roles-table-label">Roles disponibles en el historico</span>
                        <div className="stc-roles-anio-field">
                            <ManualField config={anioField} value={anio} onChange={setAnio} />
                        </div>
                    </div>
                </div>
                <div className="stc-roles-body">
                    <div className="stc-roles-lines">
                        {ROLES.map((rol, line) => (
                            <div key={rol} className="stc-roles-line">
                                <span className="stc-roles-text">{rol}</span>
                                {roles[line].map((value, box) => (
                                    <input
                                        key={box}
                                        className="stc-field-input"
                                        aria-label={`${rol} ${box + 1}`}
                                        inputMode="numeric"
                                        maxLength={BOX_DIGITS[box]}
                                        value={value}
                                        onChange={(e) => setRol(line, box, e.target.value.replace(/\D/g, ''))}
                                        // An empty single-digit box fills in its rol number: 1 for Primer Rol, 2 for Segundo, ...
                                        onClick={box === 0 && !value ? () => setRol(line, 0, String(line + 1)) : undefined}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="stc-roles-table">
                        <DataTable title="Roles disponibles en el historico" className="stc-table-roles" columns={COLUMNS} rows={rows} />
                        <ProgressBar value={progress} />
                    </div>
                </div>
            </fieldset>
        </CatalogoLayout>
    );
}
