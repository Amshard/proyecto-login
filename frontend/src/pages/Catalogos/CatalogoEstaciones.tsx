import { useMemo } from 'react';
import {
    createEstacion,
    deleteEstacion,
    type Estacion,
    getEstaciones,
    getLineas,
    updateEstacion,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import {
    catalogoActions,
    CODE_CHARS,
    codeField,
    isCodePrefix,
    lineaName,
    padCode,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from './useCatalogo';

type EstacionForm = Record<keyof Estacion, string>;

const EMPTY_FORM: EstacionForm = { id_linea: '', id_estacion: '', nombre_estacion: '' };

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2, { numeric: true, padTo: 2 }), isKey: true },
    textField('nombre_estacion', 'Nombre', 280, { maxLength: 25 }),
];

const COLUMNS: Column<Estacion>[] = [
    { header: 'Línea', cell: (r) => r.id_linea },
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Nombre de Estación', cell: (r) => r.nombre_estacion },
];

const PDF = {
    title: 'CATÁLOGO DE ESTACIONES',
    footerTitle: 'RptCatEstaciones',
    columns: [
        { header: 'Estación', cell: (r) => r.id_estacion, indent: 40, fit: true },
        { header: 'Nombre', cell: (r) => r.nombre_estacion },
    ] as Column<Estacion>[],
    countLabel: 'Estaciones',
    countTitle: 'Total de estaciones en la Red del Metro',
    countBold: true,
};

const toEstacion = (form: EstacionForm): Estacion => ({ ...form });

export default function CatalogoEstaciones() {
    const [rows, setRows] = useCatalogoRows(getEstaciones);
    const [lineas] = useCatalogoRows(getLineas);
    const nombreDeLinea = useMemo(() => {
        const nombres = new Map(lineas.map((l) => [l.id_linea, lineaName(l)]));
        return (id: string) => nombres.get(id) ?? '';
    }, [lineas]);

    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        fields: FIELDS,
        checks: {
            id_linea: (v) => {
                const id = padCode(v);
                return lineas.some((l) => l.id_linea === id) ? undefined : `La Línea ${id} no existe en el catálogo de líneas.`;
            },
        },
    });
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, toEstacion, {
        create: createEstacion,
        update: updateEstacion,
        remove: (r) => deleteEstacion(r.id_linea, r.id_estacion),
    });

    const idLinea = padCode(form.id_linea);

    const fields = useMemo(() => {
        const lineaCodes = lineas.map((l) => l.id_linea);
        const estacionesDeLinea = rows.filter((r) => r.id_linea === idLinea);
        const maxEstacion = Math.max(0, ...estacionesDeLinea.map((r) => Number(r.id_estacion) || 0));
        const extra: Record<string, object> = {
            id_linea: {
                options: lineas.map((l) => ({ value: l.id_linea, label: lineaName(l) })),
                accept: (v: string) => isCodePrefix(v, lineaCodes),
            },
            id_estacion: {
                options: estacionesDeLinea.map((r) => ({ value: r.id_estacion, label: r.nombre_estacion })),
                max: maxEstacion || undefined,
            },
        };
        return FIELDS.map((field) => ({ ...field, ...extra[field.key] }));
    }, [lineas, rows, idLinea]);

    const pdf = useMemo(
        () => ({
            ...PDF,
            rows: rows.filter((r) => r.id_linea !== '00'),
            group: {
                key: (r: Estacion) => r.id_linea,
                label: (id: string) => [`Línea ${id}`, nombreDeLinea(id)].filter(Boolean).join('     '),
                total: (id: string, count: number) =>
                    [`Total de ${count} Estaciones en la línea ${id}`, nombreDeLinea(id)].filter(Boolean).join(' '),
            },
        }),
        [rows, nombreDeLinea]
    );

    const keyFieldChange = keyChange(['id_linea', 'id_estacion'], (f) =>
        rows.find((r) => r.id_linea === padCode(f.id_linea) && r.id_estacion === padCode(f.id_estacion))
    );

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Estaciones"
            statusLabel="Catálogo de Estaciones"
            count={rows.length}
            onClear={clear}
            {...actions}
            editing={selected !== null}
            fields={
                <ManualFields
                    fields={fields}
                    form={{ ...form, nombre_linea: nombreDeLinea(idLinea) }}
                    onChange={(key: string, value) => keyFieldChange(key as keyof EstacionForm, value)}
                />
            }
            pdf={pdf}
        >
            <DataTable
                title="Estaciones"
                columns={COLUMNS}
                rows={rows}
                onRowSelect={fill}
                activeRow={selected as Estacion | null}
            />
        </CatalogoLayout>
    );
}
