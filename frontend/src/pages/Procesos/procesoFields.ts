import { useCallback, useState } from 'react';
import type { Column } from '../../components/DataTable';
import type { ManualFieldConfig } from '../../components/ManualField';

export const fixedField = <T extends string>(field: ManualFieldConfig<T>): ManualFieldConfig<T> => ({
    ...field,
    wrapStyle: { flex: 'none' },
    inputStyle: { ...field.inputStyle, width: field.inputStyle?.maxWidth },
});

export const digitWidth = (digitos: number) => ({ width: `calc(${digitos}ch + 26px)` });

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const replaceAt = <V>(list: V[], index: number, value: V) => list.map((item, i) => (i === index ? value : item));

export const headersOnly = (headers: string[]): Column<never>[] =>
    headers.map((header) => ({ header, cell: () => null, center: true }));

export const NO_ROWS: never[] = [];

const emptyForm = <T extends string>(fields: readonly { key: T }[]) =>
    Object.fromEntries(fields.map(({ key }) => [key, ''])) as Record<T, string>;

export function useForm<T extends string>(fields: readonly { key: T }[]) {
    const [form, setForm] = useState(() => emptyForm(fields));
    const setField = useCallback((key: T, value: string) => setForm((prev) => ({ ...prev, [key]: value })), []);
    const reset = useCallback(() => setForm(emptyForm(fields)), [fields]);
    return [form, setField, reset] as const;
}
