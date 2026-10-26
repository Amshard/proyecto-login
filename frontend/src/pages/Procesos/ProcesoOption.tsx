import type { ReactNode, Ref } from 'react';

interface ProcesoOptionProps {
    title?: string;
    label: string;
    checked: boolean;
    onCheck: () => void;
    inputRef?: Ref<HTMLInputElement>;
    disabled?: boolean;
    // Stretches the outline across the whole panel.
    wide?: boolean;
    // Shown inside the outline, below the radio.
    children?: ReactNode;
}

export default function ProcesoOption({ title, label, checked, onCheck, inputRef, disabled, wide, children }: ProcesoOptionProps) {
    return (
        <fieldset
            className={`stc-report-options stc-rol-options${wide ? ' stc-rol-options-wide' : ''}`}
            disabled={disabled}
        >
            {title && <legend className="stc-report-options-title">{title}</legend>}
            <label className="stc-report-option">
                <input ref={inputRef} type="radio" checked={checked} onChange={onCheck} />
                {label}
            </label>
            {children}
        </fieldset>
    );
}
