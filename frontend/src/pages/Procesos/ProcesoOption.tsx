import type { ReactNode } from 'react';
import { RadioOption } from './ProcesoControls';

interface ProcesoOptionProps {
    title?: string;
    label: string;
    checked: boolean;
    onCheck: () => void;
    disabled?: boolean;
    wide?: boolean;
    children?: ReactNode;
}

export default function ProcesoOption({ title, label, checked, onCheck, disabled, wide, children }: ProcesoOptionProps) {
    return (
        <fieldset
            className={`stc-report-options stc-rol-options${wide ? ' stc-rol-options-wide' : ''}`}
            disabled={disabled}
        >
            {title && <legend className="stc-report-options-title">{title}</legend>}
            <RadioOption label={label} checked={checked} onCheck={onCheck} />
            {children}
        </fieldset>
    );
}
