import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import { apiErrorMessage, isNotFound } from '../../api/catalogos';
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
    // Defaults to every form field.
    required?: (keyof T)[];
    noUpper?: (keyof T)[];
}

export function useCatalogoForm<T extends { [K in keyof T]: string }>(empty: T, options: FormOptions<T> = {}) {
    const [form, setForm] = useState<T>(empty);
    // Table row currently loaded into the form (null while capturing a new one).
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

    // Loads a table row into the form; keys the form doesn't have are ignored.
    const fill = (row: object) => {
        const values = row as Record<string, unknown>;
        const next = { ...empty };
        for (const key of Object.keys(empty) as (keyof T & string)[]) {
            const value = values[key];
            if (value == null) continue;
            const text = String(value);
            // Date inputs only accept YYYY-MM-DD.
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
    create?: (row: R) => Promise<void>;
    update?: (row: R) => Promise<void>;
    remove?: (row: R) => Promise<void>;
}

// Runs the database call; on failure shows the backend's reason and reports false.
async function persisted(action: Promise<void> | undefined, failure: string) {
    try {
        await action;
        return true;
    } catch (error) {
        window.alert(apiErrorMessage(error, failure));
        return false;
    }
}

// A row that is already gone from the database only needs to leave the table.
const ignoreNotFound = (error: unknown) => {
    if (!isNotFound(error)) throw error;
};

// Guardar / Modificar / Eliminar go to the database first and only change the table
// once the backend accepts them.
export function catalogoActions<R, T extends { [K in keyof T]: string }>(
    setRows: Dispatch<SetStateAction<R[]>>,
    { form, selected, setSelected, clear, validate }: CatalogoForm<T>,
    toRow: (form: T, previous?: R) => R,
    { create, update, remove }: Persistence<R> = {}
) {
    return {
        onSave: async () => {
            if (!validate()) return false;
            const row = toRow(form);
            if (!(await persisted(create?.(row), 'No se pudo guardar el registro.'))) return false;
            setRows((prev) => [...prev, row]);
            return true;
        },
        onModify: async () => {
            if (!selected || !validate()) return;
            const updated = toRow(form, selected as R);
            if (!(await persisted(update?.(updated), 'No se pudo modificar el registro.'))) return;
            setRows((prev) => prev.map((row) => (row === selected ? updated : row)));
            setSelected(updated as object);
        },
        onDelete: async () => {
            if (!selected || !window.confirm('¿Desea eliminar el registro seleccionado?')) return;
            if (!(await persisted(remove?.(selected as R).catch(ignoreNotFound), 'No se pudo eliminar el registro.'))) return;
            setRows((prev) => prev.filter((row) => row !== selected));
            clear();
        },
    };
}

type FieldStyle = { maxLength?: number; wrap?: number };

// Padding + border of .stc-field-input, so `width` keeps meaning the content width.
const INPUT_CHROME = 26;

// Fields keep their designed size when there is room, and shrink/wrap to stay inside the box.
function fluidStyles(width: number, wrap: number, input: CSSProperties) {
    const inputWidth = width + INPUT_CHROME;
    return {
        wrapStyle: { flex: `0 1 ${Math.max(wrap, inputWidth)}px` },
        inputStyle: { ...input, maxWidth: inputWidth },
    };
}

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
    }: { width?: number; wrap?: number; numeric?: boolean; padTo?: number; allowedChars?: string } = {}
): ManualFieldConfig<T> {
    return {
        id: `filtro-${key}`,
        key,
        label,
        maxLength,
        inputMode: numeric ? 'numeric' : undefined,
        padTo,
        allowedChars,
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
