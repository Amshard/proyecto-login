import { useCallback, useState } from 'react';
import type { Column } from '../../components/DataTable';
import type { ManualFieldConfig } from '../../components/ManualField';
import { codeField, labelLeft } from '../Catalogos/useCatalogo';

export const fixedField = <T extends string>(field: ManualFieldConfig<T>): ManualFieldConfig<T> => ({
    ...field,
    wrapStyle: { flex: 'none' },
    inputStyle: { ...field.inputStyle, width: field.inputStyle?.maxWidth },
});

export const sameHeight = <T extends string>(field: ManualFieldConfig<T>): ManualFieldConfig<T> => ({
    ...field,
    inputStyle: { ...field.inputStyle, height: 36 },
});

export interface RolFechas {
    rol: string;
    fechas: string[];
}

export const rolesFechasVacios = (lineas: number): RolFechas[] =>
    Array.from({ length: lineas }, () => ({ rol: '', fechas: ['', ''] }));

export const digitWidth =(digitos: number) => ({ width: `calc(${digitos}ch + 26px)` });

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const replaceAt = <V>(list: V[], index: number, value: V) => list.map((item, i) => (i === index ? value : item));

export const replaceIn = <V>(grid: V[][], fila: number, col: number, value: V) =>
    replaceAt(grid, fila, replaceAt(grid[fila], col, value));

export const campo = <T extends string>(field: ManualFieldConfig<T>) => sameHeight(fixedField(field));

export const campoIzq = <T extends string>(field: ManualFieldConfig<T>) => campo(labelLeft(field));

export const numero = <K extends string>(key: K, label: string, digitos: number, width: number) =>
    codeField(key, label, digitos, { width, numeric: true });

export const headersOnly = <R = never>(headers: string[]): Column<R>[] =>
    headers.map((header) => ({ header, cell: () => null, center: true }));

export const NO_ROWS: never[] = [];

export const conId = <F extends ManualFieldConfig<string>>(fields: F[], copia: number) =>
    fields.map((field) => ({ ...field, id: `${field.id}-${copia}` }));

const emptyForm = <T extends string>(fields: readonly { key: T }[]) =>
    Object.fromEntries(fields.map(({ key }) => [key, ''])) as Record<T, string>;

export function useForm<T extends string>(fields: readonly { key: T }[]) {
    const [form, setForm] = useState(() => emptyForm(fields));
    const setField = useCallback((key: T, value: string) => setForm((prev) => ({ ...prev, [key]: value })), []);
    const reset = useCallback(() => setForm(emptyForm(fields)), [fields]);
    return [form, setField, reset] as const;
}
