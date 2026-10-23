import { useState } from 'react';

export default function SearchModal({ initial, onApply, onClose }: { initial: string; onApply: (term: string) => void; onClose: () => void }) {
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
