import type { CSSProperties } from 'react';

export interface ManualFieldConfig<T extends string = string> {
    id: string;
    key: T;
    label: string;
    maxLength?: number;
    type?: string;
    inputMode?: 'numeric';
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
                onChange={(e) => onChange(e.target.value)}
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
