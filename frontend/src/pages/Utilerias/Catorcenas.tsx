import { useMemo } from 'react';
import { createCatorcena, deleteCatorcena, getCatorcenas, updateCatorcena, type Catorcena } from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { aFecha, ddmmyyyy, masDias, MESES, textoPeriodo } from '../../utils/fechas';
import { ManualFields } from '../../components/ManualField';
import {
    catalogoActions,
    codeField,
    dateField,
    layoutProps,
    tablaProps,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from '../Catalogos/useCatalogo';
import { sameHeight } from '../Procesos/procesoFields';
import './Utilerias.css';

type CatorcenaForm = Record<'anio' | 'id_catorcena' | 'descrip123' | 'mes' | 'fecha_ini' | 'fecha_fin' | 'periodo', string>;

const EMPTY_FORM: CatorcenaForm = { anio: '', id_catorcena: '', descrip123: '', mes: '', fecha_ini: '', fecha_fin: '', periodo: '' };

const DESCRIPCIONES = ['1ERA. DE', '2DA. DE', '3ERA. DE'];
const DIAS_SEMANA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DIAS = 14;

const lista = (values: string[]) => values.map((value) => ({ value, label: '' }));

const FIELDS = [
    { ...codeField('anio', 'Año', 4, { width: 50, numeric: true }), isKey: true },
    { ...codeField('id_catorcena', 'Catorcena', 2, { width: 25, numeric: true, padTo: 2 }), isKey: true },
    { ...textField('descrip123', 'Descripción', 100, { maxLength: 10 }), options: lista(DESCRIPCIONES), optionsButton: true },
    { ...textField('mes', 'Mes', 130, { maxLength: 10 }), options: lista(MESES), optionsButton: true },
    dateField('fecha_ini', 'Del'),
    { ...dateField('fecha_fin', 'Al'), readOnly: true },
];

const CAMPOS = FIELDS.map(sameHeight);

const fechasDesde = (del: string) => {
    if (!del) return { fecha_ini: '', fecha_fin: '', periodo: '' };
    const al = masDias(del, DIAS - 1);
    return { fecha_ini: del, fecha_fin: al, periodo: textoPeriodo(del, al) };
};

const diasDesde = (del: string) =>
    Array.from({ length: DIAS }, (_, i) => {
        const dia = aFecha(masDias(del, i));
        return { numero: String(dia.getDate()), letra: DIAS_SEMANA[dia.getDay()] };
    });

function SemanasCatorcena({ del }: { del: string }) {
    const dias = del ? diasDesde(del) : [];
    return (
        <div className="stc-catorcena-semanas">
            {[0, 1].map((semana) => (
                <div key={semana} className="stc-catorcena-semana">
                    {SEMANA.map((letra, i) => {
                        const n = semana * 7 + i;
                        return (
                            <label key={n} className="stc-catorcena-dia">
                                <span className="stc-catorcena-num">D{n + 1}</span>
                                <span className="stc-field-label">{letra}</span>
                                <input className="stc-field-input" readOnly tabIndex={-1} value={dias[n]?.numero ?? ''} />
                            </label>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

const formToRow = (form: CatorcenaForm): Catorcena => {
    const row: Catorcena = {
        anio: Number(form.anio),
        id_catorcena: form.id_catorcena.padStart(2, '0'),
        descrip123: form.descrip123,
        mes: form.mes,
        ...fechasDesde(form.fecha_ini),
    };
    diasDesde(form.fecha_ini).forEach(({ numero, letra }, i) => {
        row[`dia${i + 1}`] = numero;
        row[`idia${i + 1}`] = letra;
    });
    return row;
};

const fecha = (value: string) => ddmmyyyy(value.slice(0, 10));

const COLUMNS: Column<Catorcena>[] = [
    { header: 'Año', cell: (r) => r.anio, center: true },
    { header: 'Catorcena', cell: (r) => r.id_catorcena, center: true },
    { header: 'Descripción', cell: (r) => r.descrip123 },
    { header: 'Mes', cell: (r) => r.mes },
    { header: 'Del', cell: (r) => fecha(r.fecha_ini), center: true },
    { header: 'Al', cell: (r) => fecha(r.fecha_fin), center: true },
    { header: 'Periodo', cell: (r) => r.periodo },
];

const describe = (r: Catorcena) => `catorcena ${r.id_catorcena} de ${r.anio}`;

const checks = {
    fecha_ini: (v: string) => (aFecha(v).getDay() === 1 ? undefined : 'La catorcena debe iniciar en lunes.'),
};

export default function Catorcenas() {
    const [rows, setRows] = useCatalogoRows(getCatorcenas);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { fields: FIELDS, checks });
    const { form, keyChange, updateField } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToRow, {
        create: createCatorcena,
        update: updateCatorcena,
        remove: deleteCatorcena,
        describe,
    });

    const buscar = (anio: string, catorcena: string) =>
        catorcena.length === 2 ? rows.find((r) => String(r.anio) === anio && r.id_catorcena === catorcena) : undefined;

    const anterior = (anio: number, catorcena: number) =>
        catorcena > 1
            ? rows.find((r) => r.anio === anio && Number(r.id_catorcena) === catorcena - 1)
            : rows.filter((r) => r.anio === anio - 1).sort((a, b) => Number(b.id_catorcena) - Number(a.id_catorcena))[0];

    const ponFechas = (del: string) => {
        for (const [key, value] of Object.entries(fechasDesde(del))) updateField(key as keyof CatorcenaForm, value);
    };

    const onKeyChange = keyChange(['anio', 'id_catorcena'], (f) => buscar(f.anio, f.id_catorcena));
    const onFieldChange = (field: keyof CatorcenaForm, value: string) => {
        if (field === 'fecha_ini') return ponFechas(value);
        onKeyChange(field, value);
        if (field !== 'anio' && field !== 'id_catorcena') return;
        const next = { ...form, [field]: value };
        if (next.anio.length !== 4 || !next.id_catorcena || buscar(next.anio, next.id_catorcena.padStart(2, '0'))) return;
        const previa = anterior(Number(next.anio), Number(next.id_catorcena));
        if (previa) ponFechas(masDias(previa.fecha_fin, 1));
    };

    const sortedRows = useMemo(
        () => [...rows].sort((a, b) => b.anio - a.anio || a.id_catorcena.localeCompare(b.id_catorcena)),
        [rows]
    );

    return (
        <CatalogoLayout
            tabLabel="Catorcenas del Año"
            statusLabel="Captura Catorcenas del Año"
            {...layoutProps(rows, catalogoForm, actions)}
            fields={
                <div className="stc-manual-fields">
                    <div className="stc-campos-outline stc-catorcena-outline">
                        <ManualFields className="stc-catorcena-campos" fields={CAMPOS} form={form} onChange={onFieldChange} />
                        <SemanasCatorcena del={form.fecha_ini} />
                    </div>
                </div>
            }
            reportTitle="Catorcenas del Año"
            pdf={{
                title: 'CATORCENAS DEL AÑO',
                footerTitle: 'RptCatorcenas',
                columns: COLUMNS,
                rows: sortedRows,
                countLabel: 'Total de Catorcenas',
            }}
        >
            <DataTable
                title="Catorcenas"
                className="stc-table-catorcenas"
                rowHeader={2}
                columns={COLUMNS}
                rows={sortedRows}
                {...tablaProps<Catorcena>(catalogoForm)}
            />
        </CatalogoLayout>
    );
}
