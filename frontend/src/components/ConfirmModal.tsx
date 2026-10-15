// Si/No question over the page; Escape or a click outside answers No.
export default function ConfirmModal({ message, onYes, onNo }: { message: string; onYes: () => void; onNo: () => void }) {
    return (
        <div className="stc-search-overlay" onClick={onNo}>
            <div
                className="stc-search-modal"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') onNo();
                }}
            >
                <div className="stc-confirm-message">{message}</div>
                <div className="stc-search-modal-actions">
                    <button type="button" className="stc-btn stc-search-modal-btn" autoFocus onClick={onYes}>
                        Si
                    </button>
                    <button type="button" className="stc-btn stc-search-modal-btn" onClick={onNo}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
