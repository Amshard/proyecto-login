import type { InputHTMLAttributes, Ref } from 'react';
import { digitWidth, onlyDigits } from './procesoFields';

interface SideButton {
    label: string;
    onClick?: () => void;
    className?: string;
}

export function SideButtons({ buttons, step = 65 }: { buttons: SideButton[]; step?: number }) {
    return (
        <>
            {buttons.map(({ label, onClick, className }, i) => (
                <button
                    key={label}
                    type="button"
                    className={`stc-btn stc-exit-btn stc-carga-btn${className ? ` ${className}` : ''}`}
                    style={{ top: 220 + i * step }}
                    onClick={onClick}
                >
                    {label}
                </button>
            ))}
        </>
    );
}

interface RadioOptionProps {
    label: string;
    checked: boolean;
    onCheck: () => void;
    inputRef?: Ref<HTMLInputElement>;
}

export function RadioOption({ label, checked, onCheck, inputRef }: RadioOptionProps) {
    return (
        <label className="stc-report-option stc-proceso-radio">
            <input ref={inputRef} type="radio" checked={checked} onChange={onCheck} />
            {label}
        </label>
    );
}

export function RadioOptions({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) {
    return (
        <>
            {options.map((label) => (
                <RadioOption key={label} label={label} checked={value === label} onCheck={() => onChange(label)} />
            ))}
        </>
    );
}

type DigitInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    label: string;
    digitos: number;
    value: string;
    onChange: (value: string) => void;
    fit?: boolean;
};

export function DigitInput({ label, digitos, value, onChange, fit = true, className, style, ...rest }: DigitInputProps) {
    return (
        <input
            {...rest}
            className={`stc-field-input${className ? ` ${className}` : ''}`}
            aria-label={label}
            inputMode="numeric"
            maxLength={digitos}
            style={fit ? { ...digitWidth(digitos), ...style } : style}
            value={value}
            onChange={(e) => onChange(onlyDigits(e.target.value))}
        />
    );
}
