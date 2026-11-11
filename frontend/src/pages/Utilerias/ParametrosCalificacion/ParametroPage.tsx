import type { Parametro, ParametroApi } from '../../../api/catalogos';
import CatalogoLayout from '../../../components/CatalogoLayout';
import DataTable, { type Column } from '../../../components/DataTable';
import { CamposOutline } from '../../Catalogos/CatalogoCampos';
import {
    catalogoActions,
    codeField,
    labelLeft,
    layoutProps,
    tablaProps,
    useCatalogoForm,
    useCatalogoRows,
} from '../../Catalogos/useCatalogo';
import '../Utilerias.css';

type ParametroForm = Record<string, string>;

const DECIMAL = '0123456789.';

const esNumero = (label: string) => (v: string) => (/^\d+(\.\d+)?$/.test(v) ? undefined : `El campo ${label} debe ser un número.`);

const formToRow = (form: ParametroForm) =>
    Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)])) as Parametro;

interface Monto {
    key: string;
    label: string;
}

interface ParametroPageProps {
    api: ParametroApi;
    tabLabel: string;
    statusLabel: string;
    claveLabel: string;
    claveHeader: string;
    describe: string;
    tableTitle: string | string[];
    footerTitle: string;
    montos?: Monto[];
    puntosEnteros?: boolean;
    nota?: string;
}

export default function ParametroPage({
    api,
    tabLabel,
    statusLabel,
    claveLabel,
    claveHeader,
    describe,
    tableTitle,
    footerTitle,
    montos = [],
    puntosEnteros = false,
    nota,
}: ParametroPageProps) {
    const empty: ParametroForm = Object.fromEntries(['clave', ...montos.map((m) => m.key), 'puntos'].map((key) => [key, '']));
    const fields = [
        { ...codeField('clave', claveLabel, 2, { width: 30, numeric: true }), isKey: true },
        ...montos.map((m) => codeField(m.key, m.label, 8, { width: 80, allowedChars: DECIMAL })),
        codeField('puntos', 'Puntos', 5, { width: 50, numeric: puntosEnteros, allowedChars: puntosEnteros ? undefined : DECIMAL }),
    ].map(labelLeft);
    const columns: Column<Parametro>[] = [
        { header: claveHeader, cell: (r) => r.clave, center: true },
        ...montos.map((m): Column<Parametro> => ({ header: m.label, cell: (r) => r[m.key].toFixed(2), center: true })),
        { header: 'Puntos', cell: (r) => (puntosEnteros ? r.puntos : r.puntos.toFixed(2)), center: true },
    ];
    const checks: Record<string, (v: string, form: ParametroForm) => string | undefined> = Object.fromEntries(
        [...montos, { key: 'puntos', label: 'Puntos' }].map((m) => [m.key, esNumero(m.label)])
    );
    if (montos.length === 2) {
        const [inicial, final] = montos;
        checks[final.key] = (v, form) =>
            esNumero(final.label)(v) ??
            (Number(v) < Number(form[inicial.key]) ? `El campo ${final.label} no puede ser menor que ${inicial.label}.` : undefined);
    }

    const [rows, setRows] = useCatalogoRows(api.get);
    const catalogoForm = useCatalogoForm(empty, { fields, checks });
    const { form, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToRow, {
        create: api.create,
        update: api.update,
        remove: api.remove,
        describe: (r) => `${r.clave} ${describe}`,
    });

    const onFieldChange = keyChange(['clave'], (f) => (f.clave === '' ? undefined : rows.find((r) => r.clave === Number(f.clave))));

    return (
        <CatalogoLayout
            tabLabel={tabLabel}
            statusLabel={statusLabel}
            {...layoutProps(rows, catalogoForm, actions)}
            reportTitle="Parámetros de Calificación"
            pdf={{
                title: 'PARÁMETROS DE CALIFICACIÓN',
                subtitle: statusLabel.toUpperCase(),
                footerTitle,
                columns,
                rows: [...rows].sort((a, b) => a.clave - b.clave),
                countLabel: 'Total de Registros',
                inset: 80,
            }}
        >
            <div className="stc-utilerias-fila">
                <CamposOutline completo titulo="Parametros de Calificacion" fields={fields} form={form} onChange={onFieldChange} />
                {[tableTitle].flat().map((title) => (
                    <div key={title} className="stc-utilerias-tabla">
                        {nota && <p className="stc-utilerias-nota">{nota}</p>}
                        <DataTable
                            title={title}
                            className="stc-table-fit"
                            columns={columns}
                            rows={rows}
                            {...tablaProps<Parametro>(catalogoForm)}
                        />
                    </div>
                ))}
            </div>
        </CatalogoLayout>
    );
}
