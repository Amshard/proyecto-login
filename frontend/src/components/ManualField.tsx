import { Fragment, type CSSProperties } from 'react';

export interface ManualFieldConfig<T extends string = string> {
    id: string;
    key: T;
    label: string;
    maxLength?: number;
    type?: string;
    inputMode?: 'numeric';
    padTo?: number;
    allowedChars?: string;
    wrapStyle?: CSSProperties;
    inputStyle?: CSSProperties;
    breakAfter?: boolean;
    readOnly?: boolean;
    // Record id: read-only while an existing row is loaded.
    isKey?: boolean;
}

interface ManualFieldProps<T extends string> {
    config: ManualFieldConfig<T>;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

export default function ManualField<T extends string>({ config, value, onChange, readOnly }: ManualFieldProps<T>) {
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
                readOnly={config.readOnly || readOnly}
                value={value}
                onChange={(e) => {
                    let next = e.target.value;
                    if (config.inputMode === 'numeric') next = next.replace(/\D/g, '');
                    const { allowedChars } = config;
                    if (allowedChars) {
                        next = [...next].filter((c) => allowedChars.includes(c.toUpperCase())).join('');
                    }
                    onChange(next);
                }}
                onBlur={() => {
                    if (config.padTo && value) onChange(value.padStart(config.padTo, '0'));
                }}
                style={config.inputStyle}
            />
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
