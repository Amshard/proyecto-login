import { useState } from 'react';
import { createPersonalTaquilla, deletePersonalTaquilla, getPersonalTaquilla, type PersonalTaquilla, updatePersonalTaquilla } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { catalogoActions, codeField, dateField, expedienteField, textField, useCatalogoForm, useCatalogoRows } from './useCatalogo';

type PersonalForm = Record<keyof PersonalTaquilla, string>;

const EMPTY_FORM: PersonalForm = { id_expediente: '', nombre: '', fecha_ingreso: '', prejubilacion: '', sexo: '' };

const FIELDS = [
    { ...expedienteField('id_expediente'), isKey: true },
    textField('nombre', 'Nombre', 280, { maxLength: 50 }),
    dateField('fecha_ingreso', 'Fecha de Ingreso'),
    codeField('prejubilacion', 'Prejubilación', 1, { wrap: 90, allowedChars: 'SN' }),
    codeField('sexo', 'Genero', 1, { wrap: 70, allowedChars: 'FM' }),
];

const COLUMNS: Column<PersonalTaquilla>[] = [
    { header: 'Expediente', cell: (r) => r.id_expediente },
    { header: 'Nombre', cell: (r) => r.nombre },
    { header: 'Fecha de Ingreso', cell: (r) => r.fecha_ingreso },
    { header: 'Prejubilación', cell: (r) => r.prejubilacion },
    { header: 'FoM', cell: (r) => r.sexo },
];

export default function CatalogoPersonal() {
    const [rows, setRows] = useCatalogoRows(getPersonalTaquilla);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        noUpper: ['fecha_ingreso'],
    });
    const { form, selected, updateField, clear, fill } = catalogoForm;
    const { onSave, onModify, onDelete } = catalogoActions(
        setRows,
        catalogoForm,
        (f) => ({ ...f, id_expediente: Number(f.id_expediente) }),
        {
            create: createPersonalTaquilla,
            update: updatePersonalTaquilla,
            remove: (r) => deletePersonalTaquilla(r.id_expediente),
        },
    );
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const closeSearch = () => setSearchOpen(false);

    const openSearch = () => {
        setSearchTerm(appliedSearch);
        setSearchOpen(true);
    };

    const applySearch = (term: string) => {
        setSearchTerm(term);
        setAppliedSearch(term);
        closeSearch();
    };

    const term = appliedSearch.toUpperCase();
    const displayedRows = term
        ? rows.filter((row) => Object.values(row).some((value) => String(value).toUpperCase().includes(term)))
        : rows;

    const searchModal = searchOpen && (
        <div className="stc-search-overlay" onClick={closeSearch}>
            <div className="stc-search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="stc-search-modal-title">Buscar</div>
                <input
                    type="text"
                    className="stc-field-input stc-search-input"
                    value={searchTerm}
                    autoFocus
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') applySearch(searchTerm.trim());
                        if (e.key === 'Escape') closeSearch();
                    }}
                />
                <div className="stc-search-modal-actions">
                    <button
                        type="button"
                        className="stc-btn stc-search-modal-btn"
                        onClick={() => applySearch(searchTerm.trim())}
                    >
                        Buscar
                    </button>
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={() => applySearch('')}>
                        Limpiar
                    </button>
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={closeSearch}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <CatalogoLayout
            tabLabel="Personal de Taquilla"
            statusLabel="Catálogo de Personal de Taquilla"
            count={rows.length}
            onClear={clear}
            onSave={onSave}
            onModify={onModify}
            onDelete={onDelete}
            editing={selected !== null}
            actions={
                <button type="button" className="stc-btn stc-exit-btn stc-search-btn" onClick={openSearch}>
                    Buscar
                </button>
            }
            fields={<ManualFields fields={FIELDS} form={form} onChange={updateField} lockKeys={selected !== null} />}
            overlay={searchModal}
            pdfTitle="Catálogo de Personal de Taquilla"
            pdfColumns={COLUMNS}
            pdfRows={displayedRows}
            pdfCountLabel="Personal"
        >
            <DataTable
                title="Personal de Taquilla"
                className="stc-table-personal"
                columns={COLUMNS}
                rows={displayedRows}
                onRowSelect={fill}
                selectedRow={selected}
            />
        </CatalogoLayout>
    );
}
