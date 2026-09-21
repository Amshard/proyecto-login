import type { CSSProperties } from 'react';

export interface ManualFieldConfig<T extends string = string> {
    id: string;
    key: T;
    label: string;
    maxLength?: number;
    type?: string;
    inputMode?: 'numeric';
    /** Rellena con ceros a la izquierda al salir del campo (ej. 1 → 01). */
    padTo?: number;
    wrapStyle?: CSSProperties;
    inputStyle?: CSSProperties;
}

interface ManualFieldProps<T extends string> {
    config: ManualFieldConfig<T>;
    value: string;
    onChange: (value: string) => void;
}

export default function ManualField<T extends string>({ config, value, onChange }: ManualFieldProps<T>) {
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
                value={value}
                onChange={(e) =>
                    onChange(config.inputMode === 'numeric' ? e.target.value.replace(/\D/g, '') : e.target.value)
                }
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
}

export function ManualFields<T extends string>({ fields, form, onChange, className }: ManualFieldsProps<T>) {
    return (
        <div className={className ?? 'stc-manual-fields'}>
            {fields.map((config) => (
                <ManualField
                    key={config.key}
                    config={config}
                    value={form[config.key]}
                    onChange={(value) => onChange(config.key, value)}
                />
            ))}
        </div>
    );
}
