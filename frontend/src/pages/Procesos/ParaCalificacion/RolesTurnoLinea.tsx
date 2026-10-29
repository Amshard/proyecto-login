import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import DataTable, { type Column } from '../../../components/DataTable';
import { ManualField } from '../../../components/ManualField';
import { codeField } from '../../Catalogos/useCatalogo';
import { DigitInput, SideButtons } from '../ProcesoControls';
import { NO_ROWS, replaceAt } from '../procesoFields';
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
const BOX_DIGITS = [1, 4];

const EMPTY_ROLES = ROLES.map(() => ['', '']);

export default function RolesTurnoLinea() {
    const [anio, setAnio] = useState(() => String(new Date().getFullYear()));
    const [progress, setProgress] = useState(0);
    const [roles, setRoles] = useState(EMPTY_ROLES);

    const setRol = (line: number, box: number, value: string) =>
        setRoles((prev) => replaceAt(prev, line, replaceAt(prev[line], box, value)));

    const limpia = () => {
        setRoles(EMPTY_ROLES);
        setProgress(0);
    };

    return (
        <CatalogoLayout
            tabLabel="ROLES POR TURNO Y LÍNEA"
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Roles por Turno y Línea"
            actions={<SideButtons buttons={[{ label: 'Busca' }, { label: 'Limpia', onClick: limpia }, { label: 'Prepara Rol' }]} />}
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide stc-roles-options">
                <legend className="stc-report-options-title">Prepara Concentrado por Turno y Lines</legend>
                <div className="stc-roles-anio">
                    <div className="stc-roles-labels">
                        <span className="stc-roles-text stc-roles-lines-label">Seleccione Primer Rol</span>
                        <span className="stc-roles-text stc-roles-table-label">Roles disponibles en el historico</span>
                        <div className="stc-roles-anio-field">
                            <ManualField config={ANIO_FIELD} value={anio} onChange={setAnio} />
                        </div>
                    </div>
                </div>
                <div className="stc-roles-body">
                    <div className="stc-roles-lines">
                        {ROLES.map((rol, line) => (
                            <div key={rol} className="stc-roles-line">
                                <span className="stc-roles-text">{rol}</span>
                                {roles[line].map((value, box) => (
                                    <DigitInput
                                        key={box}
                                        label={`${rol} ${box + 1}`}
                                        digitos={BOX_DIGITS[box]}
                                        fit={false}
                                        value={value}
                                        onChange={(v) => setRol(line, box, v)}
                                        onClick={box === 0 && !value ? () => setRol(line, 0, String(line + 1)) : undefined}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="stc-roles-table">
                        <DataTable title="Roles disponibles en el historico" className="stc-table-fit" rowHeader columns={COLUMNS} rows={NO_ROWS} />
                        <ProgressBar value={progress} />
                    </div>
                </div>
            </fieldset>
        </CatalogoLayout>
    );
}
