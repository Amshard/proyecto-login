import { useMemo, useState } from 'react';
import SearchModal from './SearchModal';

export function useBusqueda<R extends object>(rows: R[]) {
    const [abierta, setAbierta] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const term = busqueda.toUpperCase();

    const filtradas = useMemo(
        () =>
            term
                ? rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toUpperCase().includes(term)))
                : rows,
        [rows, term]
    );

    const boton = (
        <button type="button" className="stc-btn stc-exit-btn" onClick={() => setAbierta(true)}>
            Buscar
        </button>
    );

    const overlay = abierta && (
        <SearchModal
            initial={busqueda}
            onApply={(value) => {
                setBusqueda(value);
                setAbierta(false);
            }}
            onClose={() => setAbierta(false)}
        />
    );

    return { filtradas, boton, overlay };
}
