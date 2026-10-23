import { useState } from 'react';
import { type RolTaquilla } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualField, type ManualFieldConfig } from '../../components/ManualField';
import SearchModal from '../../components/SearchModal';
import { useAuth } from '../../context/AuthContext';
import type { RolVigente } from '../../types/auth.types';
import { codeField, dateField, textField } from '../Catalogos/useCatalogo';
import './Procesos.css';

type RespaldoKey = 'rol1' | 'rol2' | 'rol3' | 'fecha_inicial' | 'fecha_final' | 'meses_califica' | 'estado';

const sameHeight = <T extends string>(field: ManualFieldConfig<T>) => ({
    ...field,
    inputStyle: { ...field.inputStyle, height: 36 },
});

const ROL_FIELDS = [
    codeField('rol1', 'Rol Vigente', 4, { width: 50, wrap: 50 }),
    codeField('rol2', ' ', 5, { width: 40, wrap: 40 }),
    textField('rol3', ' ', 110),
].map(sameHeight);

const ESTADO = textField('estado', 'Estado', 100);

const FIELDS = [
    dateField('fecha_inicial', 'Fecha Inicial'),
    dateField('fecha_final', 'Fecha Final'),
    textField('meses_califica', 'Meses Califica', 110),
    { ...ESTADO, inputStyle: { ...ESTADO.inputStyle, textTransform: 'none' as const } },
].map(sameHeight);

const text = (value: unknown) => (value == null ? '' : String(value));

const rolForm = (rol: RolVigente | null | undefined): Record<RespaldoKey, string> => ({
    rol1: text(rol?.fecha_ini).slice(0, 4),
    rol2: text(rol?.id_rol_anual),
    rol3: text(rol?.nombre_rol),
    fecha_inicial: text(rol?.fecha_ini).slice(0, 10),
    fecha_final: text(rol?.fecha_fin).slice(0, 10),
    meses_califica: text(rol?.meses_q_califica),
    estado: rol ? (rol.estatus_roldescansos ?? 'NO Rolado') : '',
});

const COLUMNS: Column<RolTaquilla>[] = [
    { header: 'Año', cell: (r) => r.numero, center: true },
    { header: 'Rol', cell: (r) => r.id_expediente, center: true },
    { header: 'Mes Inicid', cell: (r) => r.id_tramo, center: true },
    { header: 'Fech_ini', cell: (r) => r.faltas, center: true },
    { header: 'Fech_Fin', cell: (r) => r.id_taquilla, center: true },
    { header: 'Fec_Respldo', cell: (r) => r.categoria, center: true },
    { header: 'Lugares', cell: (r) => r.id_descansos, center: true },
];

export default function RespaldaRolVigente() {
    const rows: RolTaquilla[] = [];
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');
    const term = search.toUpperCase();
    const displayedRows = term
        ? rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toUpperCase().includes(term)))
        : rows;
    const { user } = useAuth();
    const form = rolForm(user?.rol_vigente);
    const field = (config: ManualFieldConfig<RespaldoKey>) => (
        <ManualField key={config.key} config={config} value={form[config.key]} onChange={() => {}} readOnly />
    );

    const respalda = async () => {};

    return (
        <CatalogoLayout
            tabLabel="Respalda Rol Vigente"
            statusLabel="Respalda Rol Vigente"
            count={rows.length}
            reportButton="Grava Rol Vigente"
            onReportButton={respalda}
            actions={
                <button type="button" className="stc-btn stc-exit-btn stc-search-btn" onClick={() => setSearchOpen(true)}>
                    Buscar
                </button>
            }
            overlay={
                searchOpen && (
                    <SearchModal
                        initial={search}
                        onApply={(value) => {
                            setSearch(value);
                            setSearchOpen(false);
                        }}
                        onClose={() => setSearchOpen(false)}
                    />
                )
            }
            fields={
                <div className="stc-manual-fields">
                    <div className="stc-field-group">{ROL_FIELDS.map(field)}</div>
                    {FIELDS.map(field)}
                </div>
            }
        >
            <DataTable title="Roles Respaldados en el Historico" className="stc-table-rol" columns={COLUMNS} rows={displayedRows} />
        </CatalogoLayout>
    );
}
