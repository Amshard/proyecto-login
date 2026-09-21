import { useEffect, useState } from 'react';
import type { ManualFieldConfig } from '../../components/ManualField';

export function useCatalogoRows<R>(load?: () => Promise<R[]>) {
    const [rows, setRows] = useState<R[]>([]);

    useEffect(() => {
        if (!load) return;
        let active = true;
        load()
            .then((data) => {
                if (active) setRows(data);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [load]);

    return [rows, setRows] as const;
}

interface FormOptions<T> {
    required?: (keyof T)[];
    noUpper?: (keyof T)[];
}

export function useCatalogoForm<T extends { [K in keyof T]: string }>(empty: T, options: FormOptions<T> = {}) {
    const [form, setForm] = useState<T>(empty);
    const [formError, setFormError] = useState(false);
    const required = options.required ?? (Object.keys(empty) as (keyof T)[]);

    const updateField = (field: keyof T, value: string) => {
        const keep = options.noUpper?.includes(field);
        setForm((prev) => ({ ...prev, [field]: keep ? value : value.toUpperCase() }));
        setFormError(false);
    };

    const clear = () => {
        setForm(empty);
        setFormError(false);
    };

    const validate = () => {
        const invalid = required.some((field) => form[field].trim() === '');
        setFormError(invalid);
        return !invalid;
    };

    return { form, formError, updateField, clear, validate };
}

type FieldStyle = { maxLength?: number; wrap?: number };

export function codeField<T extends string>(
    key: T,
    label: string,
    maxLength: number,
    {
        width = 25,
        wrap = 56,
        numeric = false,
        padTo,
    }: { width?: number; wrap?: number; numeric?: boolean; padTo?: number } = {}
): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        maxLength,
        inputMode: numeric ? 'numeric' : undefined,
        padTo,
        wrapStyle: { width: wrap },
        inputStyle: { width, height: 30, textAlign: 'center', textTransform: 'uppercase' },
    };
}

export function textField<T extends string>(
    key: T,
    label: string,
    width: number,
    { maxLength, wrap = width }: FieldStyle = {}
): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        maxLength,
        wrapStyle: { width: wrap },
        inputStyle: { width, height: 36, textTransform: 'uppercase' },
    };
}

export function dateField<T extends string>(key: T, label: string): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        type: 'date',
        wrapStyle: { width: 150 },
        inputStyle: { width: 150, height: 36 },
    };
}

export function expedienteField<T extends string>(key: T): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label: 'Expediente',
        maxLength: 6,
        inputMode: 'numeric',
        wrapStyle: { width: 110 },
        inputStyle: { width: 90, height: 36, textAlign: 'center' },
    };
}
