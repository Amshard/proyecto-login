import { useState } from 'react';
import {
    createPersonalTaquilla,
    deletePersonalTaquilla,
    getPersonalTaquilla,
    getRolTaquilla,
    type PersonalTaquilla,
    type RolTaquilla,
    updatePersonalTaquilla,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, dateField, expedienteField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type PersonalForm = Record<keyof PersonalTaquilla, string>;

const EMPTY_FORM: PersonalForm = { id_expediente: '', nombre: '', fecha_ingreso: '', prejubilacion: '', sexo: '' };

const NOMBRE_RE = /^[A-ZÁÉÍÓÚÜÑ ]+$/i;
const notZero = (v: string) => v !== '0';

const FIELDS = [
    { ...expedienteField('id_expediente'), isKey: true, accept: notZero },
    { ...textField('nombre', 'Nombre', 280, { maxLength: 50 }), accept: (v: string) => NOMBRE_RE.test(v) },
    dateField('fecha_ingreso', 'Fecha de Ingreso'),
    codeField('prejubilacion', 'Jubilación', 1, { wrap: 90, allowedChars: 'SN' }),
    codeField('sexo', 'Genero', 1, { wrap: 70, allowedChars: 'FM' }),
];

const ROL_MESSAGE = 'Debe asignar a un Rol disponible';
const ROL_OCUPADO_MESSAGE = 'Esta Posición esta ocupada en el ROL Verifique';

type RolKey = keyof RolTaquilla | 'jubdo';

// Shows a rol_taquilla column; only Posición en el ROL is typed in, the rest come from that position.
const rolField = (key: RolKey, label: string, maxLength: number, width = 50) => ({
    ...codeField(key, label, maxLength, { width, wrap: width + 30 }),
    id: `rol-${key}`,
    readOnly: key !== 'numero',
});

const ROL_FIELDS = [
    { ...rolField('numero', 'Posición en el ROL', 4, 60), inputMode: 'numeric' as const, accept: notZero },
    rolField('id_expediente', 'Expediente', 6, 70),
    rolField('id_tramo', 'Tramo', 5),
    rolField('faltas', 'Faltas', 5),
    rolField('id_taquilla', 'Taquilla', 5),
    rolField('categoria', 'Categoría', 5),
    rolField('id_descansos', 'Descansos', 2),
    rolField('lugar', 'Lugar', 5),
    rolField('calificacion', 'Calificación', 6, 60),
    rolField('turno', 'Turno', 1, 30),
    rolField('id_permanencia', 'Perm.', 1, 30),
    rolField('jubdo', 'Jubdo', 5),
];

const rolForm = (numero: string, rol: RolTaquilla | undefined) => {
    const values: Partial<Record<RolKey, unknown>> = { ...rol, numero, jubdo: '' };
    return Object.fromEntries(ROL_FIELDS.map(({ key }) => [key, String(values[key] ?? '')])) as Record<RolKey, string>;
};

// Local date as YYYY-MM-DD.
const todayIso = () => new Date().toLocaleDateString('en-CA');

const formatDate = (iso: string) => iso.split('-').reverse().join('/');

const COLUMNS: Column<PersonalTaquilla>[] = [
    { header: 'Expediente', cell: (r) => r.id_expediente },
    { header: 'Nombre', cell: (r) => r.nombre },
    { header: 'Fecha de Ingreso', cell: (r) => r.fecha_ingreso },
    { header: 'Prejubilación', cell: (r) => r.prejubilacion },
    { header: 'FoM', cell: (r) => r.sexo },
];

function SearchModal({ initial, onApply, onClose }: { initial: string; onApply: (term: string) => void; onClose: () => void }) {
    const [term, setTerm] = useState(initial);
    const apply = () => onApply(term.trim());

    return (
        <div className="stc-search-overlay" onClick={onClose}>
            <div className="stc-search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="stc-search-modal-title">Buscar</div>
                <input
                    type="text"
                    className="stc-field-input stc-search-input"
                    value={term}
                    autoFocus
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') apply();
                        if (e.key === 'Escape') onClose();
                    }}
                />
                <div className="stc-search-modal-actions">
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={apply}>
                        Buscar
                    </button>
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={() => onApply('')}>
                        Limpiar
                    </button>
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CatalogoPersonal() {
    const [rows, setRows] = useCatalogoRows(getPersonalTaquilla);
    const [rolRows, setRolRows] = useCatalogoRows(getRolTaquilla);
    const [numero, setNumero] = useState('');
    // The rol boxes keep their space but stay invisible until Guardar asks a new person for a free position.
    const [showRol, setShowRol] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState('');

    const maxDate = todayIso();
    const minDate = rows.reduce<string | undefined>((oldest, r) => {
        const fecha = String(r.fecha_ingreso ?? '').slice(0, 10);
        return fecha && (!oldest || fecha < oldest) ? fecha : oldest;
    }, undefined);
    const fields = FIELDS.map((f) => (f.key === 'fecha_ingreso' ? { ...f, minDate, maxDate } : f));

    // Prejubilación and Genero need no check: their inputs only take S/N and F/M.
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        noUpper: ['fecha_ingreso'],
        fields: FIELDS,
        checks: {
            id_expediente: (v) => (Number(v) >= 1 ? undefined : 'El campo Expediente debe ser un número mayor a 0.'),
            nombre: (v) => (NOMBRE_RE.test(v) ? undefined : 'El campo Nombre solo puede contener letras y espacios.'),
            fecha_ingreso: (v) => {
                if (v > maxDate) return 'El campo Fecha de Ingreso no puede ser posterior a la fecha actual.';
                if (minDate && v < minDate) return `El campo Fecha de Ingreso no puede ser anterior al ${formatDate(minDate)}.`;
            },
        },
    });
    const { form, selected, clear, fill, keyChange, validate } = catalogoForm;

    const rol = rolRows.find((r) => String(r.numero) === numero);
    const patchRol = (match: (r: RolTaquilla) => boolean, changes: Partial<RolTaquilla>) =>
        setRolRows((prev) => prev.map((r) => (match(r) ? { ...r, ...changes } : r)));

    const actions = catalogoActions(setRows, catalogoForm, (f) => ({ ...f, id_expediente: Number(f.id_expediente) }), {
        create: (row) => createPersonalTaquilla(row, Number(numero)),
        update: updatePersonalTaquilla,
        // The server also frees the person's position in the rol.
        remove: async (row) => {
            await deletePersonalTaquilla(row.id_expediente);
            patchRol((r) => r.id_expediente === row.id_expediente, { id_expediente: 0, faltas: 0, calificacion: '0.00' });
        },
    });
    const onFieldChange = keyChange(['id_expediente'], (f) => rows.find((r) => String(r.id_expediente) === f.id_expediente));

    const hideRol = () => {
        setNumero('');
        setShowRol(false);
    };

    const onSave = async () => {
        if (!validate()) return false;
        // Only a position whose id_expediente is 0 can take the new person.
        if (rol?.id_expediente !== 0) {
            setShowRol(true);
            window.alert(rol ? ROL_OCUPADO_MESSAGE : ROL_MESSAGE);
            return false;
        }
        if (!(await actions.onSave())) return false;
        patchRol((r) => r.numero === rol.numero, { id_expediente: Number(form.id_expediente) });
        hideRol();
        return true;
    };

    const term = search.toUpperCase();
    const displayedRows = term
        ? rows.filter((row) => Object.values(row).some((value) => String(value).toUpperCase().includes(term)))
        : rows;

    return (
        <CatalogoLayout
            tabLabel="Personal de Taquilla"
            statusLabel="Catálogo de Personal de Taquilla"
            count={rows.length}
            {...actions}
            onClear={() => {
                clear();
                hideRol();
            }}
            onSave={onSave}
            editing={selected !== null}
            actions={
                <button type="button" className="stc-btn stc-exit-btn stc-search-btn" onClick={() => setSearchOpen(true)}>
                    Buscar
                </button>
            }
            fields={
                <>
                    <ManualFields fields={fields} form={form} onChange={onFieldChange} />
                    <ManualFields
                        className={`stc-manual-fields stc-rol-fields${showRol && !selected ? '' : ' stc-rol-fields-hidden'}`}
                        fields={ROL_FIELDS}
                        form={rolForm(numero, rol)}
                        onChange={(key, value) => key === 'numero' && setNumero(value)}
                    />
                </>
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
            pdf={{ title: 'Catálogo de Personal de Taquilla', columns: COLUMNS, rows: displayedRows, countLabel: 'Personal' }}
        >
            <DataTable
                title="Personal de Taquilla"
                className="stc-table-personal"
                columns={COLUMNS}
                rows={displayedRows}
                onRowSelect={fill}
                activeRow={selected as PersonalTaquilla | null}
            />
        </CatalogoLayout>
    );
}
