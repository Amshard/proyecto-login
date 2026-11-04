import type { InputHTMLAttributes, Ref } from 'react';
import { digitWidth, onlyDigits } from './procesoFields';

interface SideButton {
    label: string;
    onClick?: () => void;
    className?: string;
}

export function SideButtons({ buttons }: { buttons: SideButton[] }) {
    return (
        <>
            {buttons.map(({ label, onClick, className }) => (
                <button
                    key={label}
                    type="button"
                    className={`stc-btn stc-exit-btn stc-carga-btn${className ? ` ${className}` : ''}`}
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
    disabled?: boolean;
}

export function RadioOption({ label, checked, onCheck, inputRef, disabled }: RadioOptionProps) {
    return (
        <label className={`stc-report-option stc-proceso-radio${disabled ? ' stc-radio-bloqueado' : ''}`}>
            <input ref={inputRef} type="radio" checked={checked} onChange={onCheck} disabled={disabled} />
            {label}
        </label>
    );
}

interface RadioOptionsProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    disabled?: string[];
}

export function RadioOptions({ options, value, onChange, disabled }: RadioOptionsProps) {
    return (
        <>
            {options.map((label) => (
                <RadioOption
                    key={label}
                    label={label}
                    checked={value === label}
                    onCheck={() => onChange(label)}
                    disabled={disabled?.includes(label)}
                />
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
