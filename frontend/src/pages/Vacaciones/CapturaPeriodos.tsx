import { useMemo } from 'react';
import {
    createPeriodoVacacional,
    deletePeriodoVacacional,
    getPeriodosVacacionales,
    updatePeriodoVacacional,
    type PeriodoVacacional,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { ddmmyyyy, textoPeriodo } from '../../utils/fechas';
import { openPdf } from '../../utils/openPdf';
import { catalogoActions, dateField, layoutProps, tablaProps, textField, useCatalogoForm, useCatalogoRows } from '../Catalogos/useCatalogo';
import { campo, numero } from '../Procesos/procesoFields';
import '../Reportes/Reportes.css';
import { reporteTab } from './reporteTab';
import './Vacaciones.css';

type PeriodoForm = Record<'anio' | 'id_periodovac' | 'fecha_ini' | 'fecha_fin' | 'periodo', string>;

const EMPTY_FORM: PeriodoForm = { anio: '', id_periodovac: '', fecha_ini: '', fecha_fin: '', periodo: '' };

const FIELDS = [
    { ...numero('anio', 'Año', 4, 60), isKey: true },
    { ...numero('id_periodovac', 'Numero', 2, 50), padTo: 2, isKey: true },
    dateField('fecha_ini', 'Del'),
    dateField('fecha_fin', 'Al'),
    textField('periodo', 'ㅤ', 420, { maxLength: 60 }),
].map(campo);

const TITULO = 'Catálogo de Periodos Vacacionales';

const fecha = (value: string | null) => (value ? ddmmyyyy(value.slice(0, 10)) : '');

const COLUMNAS: Column<PeriodoVacacional>[] = [
    { header: 'Año', cell: (r) => r.anio, center: true },
    { header: 'Periodo', cell: (r) => r.id_periodovac, center: true },
    { header: 'Del', cell: (r) => fecha(r.fecha_ini), center: true },
    { header: 'Al', cell: (r) => fecha(r.fecha_fin), center: true },
    { header: 'Descripción Periodo', cell: (r) => r.periodo },
];

const formToRow = (form: PeriodoForm): PeriodoVacacional => ({
    anio: Number(form.anio),
    id_periodovac: form.id_periodovac.padStart(2, '0'),
    fecha_ini: form.fecha_ini || null,
    fecha_fin: form.fecha_fin || null,
    periodo: form.periodo || null,
});

const checks = {
    fecha_fin: (v: string, f: PeriodoForm) =>
        f.fecha_ini && v < f.fecha_ini ? 'El campo Al no puede ser anterior al campo Del.' : undefined,
};

export default function CapturaPeriodos() {
    const [rows, setRows] = useCatalogoRows(getPeriodosVacacionales);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { fields: FIELDS, checks });
    const { form, keyChange, updateField } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToRow, {
        create: createPeriodoVacacional,
        update: updatePeriodoVacacional,
        remove: deletePeriodoVacacional,
        describe: (r) => `periodo ${r.id_periodovac} de ${r.anio}`,
    });

    const onKeyChange = keyChange(['anio', 'id_periodovac'], (f) =>
        f.id_periodovac.length === 2 ? rows.find((r) => String(r.anio) === f.anio && r.id_periodovac === f.id_periodovac) : undefined
    );
    const onFieldChange = (field: keyof PeriodoForm, value: string) => {
        onKeyChange(field, value);
        if (field !== 'fecha_ini' && field !== 'fecha_fin') return;
        const next = { ...form, [field]: value };
        if (next.fecha_ini && next.fecha_fin && next.fecha_fin >= next.fecha_ini)
            updateField('periodo', textoPeriodo(next.fecha_ini, next.fecha_fin));
    };

    const sortedRows = useMemo(
        () => [...rows].sort((a, b) => b.anio - a.anio || a.id_periodovac.localeCompare(b.id_periodovac)),
        [rows]
    );
    const filasAnio = useMemo(() => sortedRows.filter((r) => String(r.anio) === form.anio), [sortedRows, form.anio]);

    const generarReporte = () =>
        openPdf({ title: TITULO.toUpperCase(), footerTitle: 'RptPeriodosVac', columns: COLUMNAS, rows: sortedRows, countLabel: 'Total de Periodos' });

    return (
        <CatalogoLayout
            tabLabel={TITULO}
            statusLabel={TITULO}
            {...layoutProps(rows, catalogoForm, actions)}
            countOnAllTabs
            extraTabs={[reporteTab(TITULO, generarReporte)]}
            fields={
                <div className="stc-manual-fields">
                    <fieldset className="stc-reporte-outline stc-captura-outline">
                        <ManualFields className="stc-captura-fila stc-periodos-fila" fields={FIELDS} form={form} onChange={onFieldChange} />
                    </fieldset>
                </div>
            }
        >
            <div className="stc-captura-columna">
                <DataTable
                    title=""
                    className="stc-table-fit stc-captura-tabla"
                    columns={COLUMNAS}
                    rows={filasAnio}
                    {...tablaProps<PeriodoVacacional>(catalogoForm)}
                />
            </div>
        </CatalogoLayout>
    );
}
