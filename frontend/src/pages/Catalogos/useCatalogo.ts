import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { apiErrorMessage, isNotFound, type Linea } from '../../api/catalogos';
import type { ManualFieldConfig } from '../../components/ManualField';

export function useCatalogoRows<R>(load: () => Promise<R[]>) {
    const [rows, setRows] = useState<R[]>([]);

    useEffect(() => {
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
    const [selected, setSelected] = useState<object | null>(null);
    const required = options.required ?? (Object.keys(empty) as (keyof T)[]);

    const updateField = (field: keyof T, value: string) => {
        const keep = options.noUpper?.includes(field);
        setForm((prev) => ({ ...prev, [field]: keep ? value : value.toUpperCase() }));
    };

    const clear = () => {
        setForm(empty);
        setSelected(null);
    };

    const fill = (row: object) => {
        const values = row as Record<string, unknown>;
        const next = { ...empty };
        for (const key of Object.keys(empty) as (keyof T & string)[]) {
            const value = values[key];
            if (value == null) continue;
            const text = String(value);
            (next as Record<string, string>)[key] = /^\d{4}-\d{2}-\d{2}T/.test(text) ? text.slice(0, 10) : text;
        }
        setForm(next);
        setSelected(row);
    };

    const validate = () => {
        const invalid = required.some((field) => form[field].trim() === '');
        if (invalid) window.alert('Por favor llene todos los campos antes de guardar.');
        return !invalid;
    };

    return { form, selected, setSelected, updateField, clear, fill, validate };
}

type CatalogoForm<T> = ReturnType<typeof useCatalogoForm<T & { [K in keyof T]: string }>>;

interface Persistence<R> {
    create: (row: R) => Promise<void>;
    // Without it the catalogo offers no Modificar button.
    update?: (row: R) => Promise<void>;
    remove: (row: R) => Promise<void>;
    // Names the record in the modify/delete messages, e.g. "Línea 3".
    describe?: (row: R) => string;
}

async function persisted(action: Promise<void>, failure: string) {
    try {
        await action;
        return true;
    } catch (error) {
        window.alert(apiErrorMessage(error, failure));
        return false;
    }
}

const ignoreNotFound = (error: unknown) => {
    if (!isNotFound(error)) throw error;
};

export function catalogoActions<R, T extends { [K in keyof T]: string }>(
    setRows: Dispatch<SetStateAction<R[]>>,
    { form, selected, setSelected, clear, validate }: CatalogoForm<T>,
    toRow: (form: T, previous?: R) => R,
    { create, update, remove, describe }: Persistence<R>
) {
    return {
        onSave: async () => {
            if (!validate()) return false;
            const row = toRow(form);
            if (!(await persisted(create(row), 'No se pudo guardar el registro.'))) return false;
            setRows((prev) => [...prev, row]);
            return true;
        },
        onModify: update && (async () => {
            if (!selected || !validate()) return;
            const updated = toRow(form, selected as R);
            if (!(await persisted(update(updated), 'No se pudo modificar el registro.'))) return;
            setRows((prev) => prev.map((row) => (row === selected ? updated : row)));
            setSelected(updated as object);
            window.alert(describe ? `Se modificó correctamente: ${describe(updated)}.` : 'Registro modificado correctamente.');
        }),
        onDelete: async () => {
            if (!selected) return;
            const deleted = describe?.(selected as R);
            if (!window.confirm(deleted ? `¿Desea eliminar el registro ${deleted}?` : '¿Desea eliminar el registro seleccionado?')) return;
            if (!(await persisted(remove(selected as R).catch(ignoreNotFound), 'No se pudo eliminar el registro.'))) return;
            setRows((prev) => prev.filter((row) => row !== selected));
            clear();
            window.alert(deleted ? `Se eliminó correctamente: ${deleted}.` : 'Registro eliminado correctamente.');
        },
    };
}

type FieldStyle = { maxLength?: number; wrap?: number };

const INPUT_CHROME = 26;

function fluidStyles(width: number, wrap: number, input: CSSProperties) {
    const inputWidth = width + INPUT_CHROME;
    return {
        wrapStyle: { flex: `0 1 ${Math.max(wrap, inputWidth)}px` },
        inputStyle: { ...input, maxWidth: inputWidth },
    };
}

// Characters allowed in Línea/Estación codes: digits plus the lettered lines (0A, 0B).
export const CODE_CHARS = '0123456789AB';

export const padCode = (value: string) => (value ? value.padStart(2, '0') : '');

// "Terminal 1-Terminal 2" name of a línea, as shown next to its code.
export const lineaName = (linea: Linea | undefined) =>
    linea ? [linea.nombre_dirlin1, linea.nombre_dirlin2].filter(Boolean).join('-') : '';

// True when some existing code can still be reached from what has been typed so far.
// A single character also matches its padded form, so "A" is accepted for 0A.
export const isCodePrefix = (typed: string, codes: string[]) => {
    const value = typed.toUpperCase();
    return codes.some((code) => code.startsWith(value) || code === padCode(value));
};

export function codeField<T extends string>(
    key: T,
    label: string,
    maxLength: number,
    {
        width = 25,
        wrap = 56,
        numeric = false,
        padTo,
        allowedChars,
        nonZero,
    }: {
        width?: number;
        wrap?: number;
        numeric?: boolean;
        padTo?: number;
        allowedChars?: string;
        nonZero?: boolean;
    } = {}
): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        maxLength,
        inputMode: numeric ? 'numeric' : undefined,
        padTo,
        allowedChars,
        nonZero,
        ...fluidStyles(width, wrap, { height: 30, textAlign: 'center', textTransform: 'uppercase' }),
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
        ...fluidStyles(width, wrap, { height: 36, textTransform: 'uppercase' }),
    };
}

export function dateField<T extends string>(key: T, label: string): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        type: 'date',
        ...fluidStyles(150, 150, { height: 36 }),
    };
}

export function expedienteField<T extends string>(key: T): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label: 'Expediente',
        maxLength: 6,
        inputMode: 'numeric',
        ...fluidStyles(90, 110, { height: 36, textAlign: 'center' }),
    };
}
