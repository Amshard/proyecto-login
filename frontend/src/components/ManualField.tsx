import { Fragment, useState, type CSSProperties } from 'react';

export interface ManualFieldConfig<T extends string = string> {
    id: string;
    key: T;
    label: string;
    maxLength?: number;
    type?: string;
    inputMode?: 'numeric';
    padTo?: number;
    allowedChars?: string;
    // Numeric fields that reject 0: leading zeros are dropped while typing.
    nonZero?: boolean;
    wrapStyle?: CSSProperties;
    inputStyle?: CSSProperties;
    breakAfter?: boolean;
    readOnly?: boolean;
    // Record id: read-only while an existing row is loaded.
    isKey?: boolean;
    // Suggestions shown as a dropdown under the input (always the full list); free typing still works.
    options?: { value: string; label: string }[];
}

interface ManualFieldProps<T extends string> {
    config: ManualFieldConfig<T>;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

export default function ManualField<T extends string>({ config, value, onChange, readOnly }: ManualFieldProps<T>) {
    const [open, setOpen] = useState(false);
    const locked = config.readOnly || readOnly;
    const showOptions = open && !locked && !!config.options?.length;

    return (
        <div className="stc-manual-field" style={config.wrapStyle}>
            <label className="stc-field-label" htmlFor={config.id}>
                {config.label}
            </label>
            <input
                id={config.id}
                className="stc-field-input"
                type={config.type ?? 'text'}
                inputMode={config.inputMode}
                maxLength={config.maxLength}
                readOnly={locked}
                value={value}
                onChange={(e) => {
                    let next = e.target.value;
                    if (config.inputMode === 'numeric') next = next.replace(/\D/g, '');
                    if (config.nonZero) next = next.replace(/^0+/, '');
                    const { allowedChars } = config;
                    if (allowedChars) {
                        next = [...next].filter((c) => allowedChars.includes(c.toUpperCase())).join('');
                    }
                    onChange(next);
                }}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpen(false);
                    if (e.key === 'ArrowDown') setOpen(true);
                }}
                onBlur={() => {
                    setOpen(false);
                    if (config.padTo && value) onChange(value.padStart(config.padTo, '0'));
                }}
                style={config.inputStyle}
                autoComplete={config.options ? 'off' : undefined}
            />
            {showOptions && (
                // A datalist would filter by what's typed; this list always shows every option.
                <ul className="stc-field-options">
                    {config.options!.map((option) => (
                        <li
                            key={option.value}
                            className={option.value === value ? 'stc-field-option-active' : undefined}
                            // mousedown keeps focus in the input so onBlur doesn't close the list first.
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(option.value);
                                setOpen(false);
                            }}
                        >
                            <span className="stc-field-option-value">{option.value}</span> {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

interface ManualFieldsProps<T extends string> {
    fields: ManualFieldConfig<T>[];
    form: Record<T, string>;
    onChange: (key: T, value: string) => void;
    className?: string;
    lockKeys?: boolean;
}

export function ManualFields<T extends string>({ fields, form, onChange, className, lockKeys }: ManualFieldsProps<T>) {
    return (
        <div className={className ?? 'stc-manual-fields'}>
            {fields.map((config) => (
                <Fragment key={config.key}>
                    <ManualField
                        config={config}
                        value={form[config.key]}
                        onChange={(value) => onChange(config.key, value)}
                        readOnly={lockKeys && config.isKey}
                    />
                    {config.breakAfter && <div className="stc-field-break" />}
                </Fragment>
            ))}
        </div>
    );
}
