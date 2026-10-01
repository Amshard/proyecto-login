import { useMemo } from 'react';
import {
    createTaquilla,
    deleteTaquilla,
    getEstaciones,
    getLineas,
    getTaquillas,
    getTaquillasOperacion,
    type Linea,
    type Taquilla,
    updateTaquilla,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { openPdf } from '../../utils/pdf';
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

type TaquillaForm = Record<
    'id_taquilla' | 'turno' | 'dirdelinea' | 'extension_tel' | 'id_linea' | 'id_estacion',
    string
>;

const EMPTY_FORM: TaquillaForm = {
    id_taquilla: '',
    turno: '',
    dirdelinea: '',
    extension_tel: '',
    id_linea: '',
    id_estacion: '',
};

const taquillaCode = (linea: string, estacion: string, digit: string) =>
    padCode(linea) + padCode(estacion) + digit.slice(-1);

const direccionName = (linea: Linea | undefined, dir: number) => {
    if (linea && dir === linea.dirdelinea1) return linea.nombre_dirlin1;
    if (linea && dir === linea.dirdelinea2) return linea.nombre_dirlin2;
    return '';
};

const FIELDS = [
    { ...codeField('id_linea', 'Línea', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_linea', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_estacion', 'Estación', 2, { padTo: 2, allowedChars: CODE_CHARS }), isKey: true },
    { ...textField('nombre_estacion', 'Nombre', 280), readOnly: true, breakAfter: true },
    { ...codeField('id_taquilla', 'Taquilla', 1, { width: 60, wrap: 80, numeric: true }), isKey: true },
    { ...codeField('turno', 'Turno', 1, { numeric: true }), isKey: true },
    codeField('dirdelinea', 'Dir. Línea', 1, { width: 60, wrap: 90, numeric: true, allowedChars: '012' }),
    { ...textField('nombre_direccion', 'Dirección', 150, { wrap: 170 }), readOnly: true },
    textField('extension_tel', 'Extensión', 110, { maxLength: 10, wrap: 130 }),
];

const REQUIRED = (Object.keys(EMPTY_FORM) as (keyof TaquillaForm)[]).filter((key) => key !== 'extension_tel');

const taquillaColumns = (direccion: (r: Taquilla) => string): Column<Taquilla>[] => [
    { header: 'Taquilla', cell: (r) => r.id_taquilla },
    { header: 'Estación', cell: (r) => r.id_estacion },
    { header: 'Turno', cell: (r) => r.turno },
    { header: 'DirLin', cell: (r) => r.dirdelinea },
    { header: 'Dirección', cell: (r) => direccion(r) || 'SIN DIRECCION DE LINEA' },
    { header: 'ExtTel', cell: (r) => r.extension_tel },
    { header: 'Línea', cell: (r) => r.id_linea },
];

const porTaquilla = (r: Taquilla) => r.id_taquilla;
// Space between the parts of a report heading, e.g. "ESTACIÓN 01     PANTITLAN".
const HEADING_GAP = '     ';
const reportColumns = (lineaDe: (r: Taquilla) => Linea | undefined): Column<Taquilla>[] => [
    { header: 'Taquilla', cell: (r) => r.id_taquilla, repeatKey: porTaquilla, indent: 28 },
    { header: 'Turno', cell: (r) => r.turno, center: true },
    { header: 'ExtTel', cell: (r) => r.extension_tel },
    {
        header: 'Dirección de Línea',
        cell: (r) => {
            const l = lineaDe(r);
            return [r.dirdelinea, l?.nombre_dirlin1, l?.nombre_dirlin2].filter((part) => part != null).join('     ');
        },
        repeatKey: porTaquilla,
    },
];

const TOTAL_EN_RED = {
    countText: (rows: Taquilla[]) => `Total de ${new Set(rows.map((r) => r.id_taquilla)).size} Taquillas en la red`,
    countBold: true,
    countUnderline: true,
};

const formToTaquilla =(form: TaquillaForm, previous?: Taquilla): Taquilla => ({
    ...previous,
    ...form,
    id_linea: padCode(form.id_linea),
    id_estacion: padCode(form.id_estacion),
    id_taquilla: taquillaCode(form.id_linea, form.id_estacion, form.id_taquilla),
    dirdelinea: Number(form.dirdelinea) || 0,
    extension_tel: form.extension_tel || null,
});

export default function CatalogoTaquillas() {
    const [rows, setRows] = useCatalogoRows(getTaquillas);
    const [lineas] = useCatalogoRows(getLineas);
    const [estaciones] = useCatalogoRows(getEstaciones);
    const [enOperacion] = useCatalogoRows(getTaquillasOperacion);
    const catalogoForm = useCatalogoForm(EMPTY_FORM, { required: REQUIRED });
    const { form, selected, clear, fill, keyChange } = catalogoForm;
    const actions = catalogoActions(setRows, catalogoForm, formToTaquilla, {
        create: createTaquilla,
        update: updateTaquilla,
        remove: (r) => deleteTaquilla(r.id_taquilla, r.turno),
    });

    const onSave = async () => {
        const saved = await actions.onSave();
        if (saved && !form.extension_tel.trim()) {
            window.alert('Taquilla guardada sin extensión, posteriormente podrá asignarla.');
        }
    };

    const idLinea = padCode(form.id_linea);
    const idEstacion = padCode(form.id_estacion);
    const linea = lineas.find((l) => l.id_linea === idLinea);

    const { columns, operacionColumns, report } = useMemo(() => {
        const porId = new Map(lineas.map((l) => [l.id_linea, l]));
        const nombresEstacion = new Map(estaciones.map((e) => [`${e.id_linea}|${e.id_estacion}`, e.nombre_estacion]));
        const estacionDe = (r: Taquilla) => nombresEstacion.get(`${r.id_linea}|${r.id_estacion}`) ?? '';
        const direccion = (r: Taquilla) => direccionName(porId.get(r.id_linea), r.dirdelinea);
        const taquillasEn = (rs: Taquilla[]) => new Set(rs.map((r) => r.id_taquilla)).size;
        const join = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join('     ');
        return {
            columns: taquillaColumns(direccion),
            operacionColumns: [
                { header: 'Taquilla', cell: (r) => r.id_taquilla },
                { header: 'Turno', cell: (r) => r.turno, center: true },
                { header: 'Línea', cell: (r) => r.id_linea, center: true },
                { header: 'Nombre de la estación', cell: estacionDe },
            ] as Column<Taquilla>[],
            report: {
                columns: reportColumns((r) => porId.get(r.id_linea)),
                fontSize: 9,
                rowPadding: 2,
                // Rows start under the estación name (every estación code is two digits wide).
                rowsAlignWith: `ESTACIÓN 00${HEADING_GAP}`,
                sections: [
                    {
                        key: (r: Taquilla) => r.id_linea,
                        label: (r: Taquilla) => join(`LÍNEA ${r.id_linea}`, lineaName(porId.get(r.id_linea))),
                        total: (rs: Taquilla[]) =>
                            `${taquillasEn(rs)} Taquillas en la Línea ${rs[0].id_linea} ${lineaName(porId.get(rs[0].id_linea))}`.trim(),
                        pageBreak: true,
                    },
                    {
                        key: (r: Taquilla) => r.id_estacion,
                        label: (r: Taquilla) => join(`ESTACIÓN ${r.id_estacion}`, estacionDe(r)),
                        total: (rs: Taquilla[]) =>
                            `${taquillasEn(rs)} Taquillas en la Estación ${rs[0].id_estacion} ${estacionDe(rs[0])}`.trim(),
                    },
                ],
            },
        };
    }, [lineas, estaciones]);
    const nombreEstacion =
        estaciones.find((e) => e.id_linea === idLinea && e.id_estacion === idEstacion)?.nombre_estacion ?? '';

    const idTaquilla =
        form.id_linea && form.id_estacion && form.id_taquilla
            ? taquillaCode(form.id_linea, form.id_estacion, form.id_taquilla)
            : '';

    const fields = useMemo(() => {
        const turnoOptions = idTaquilla
            ? rows.filter((r) => r.id_taquilla === idTaquilla).map((r) => ({ value: r.turno, label: direccionName(linea, r.dirdelinea) }))
            : [...new Set(rows.map((r) => r.turno))].map((turno) => ({ value: turno, label: '' }));
        turnoOptions.sort((a, b) => Number(a.value) - Number(b.value));
        const prefix = form.id_linea && form.id_estacion ? idLinea + idEstacion : '';
        const taquillaDigits = prefix
            ? rows
                  .filter((r) => r.id_taquilla.length === prefix.length + 1 && r.id_taquilla.startsWith(prefix))
                  .map((r) => r.id_taquilla.slice(-1))
            : [];
        const taquillaOptions = [...new Set(taquillaDigits)].sort().map((digit) => ({ value: digit, label: '' }));
        const lineaOptions = lineas.map((l) => ({ value: l.id_linea, label: lineaName(l) }));
        const estacionOptions = estaciones
            .filter((e) => e.id_linea === idLinea)
            .map((e) => ({ value: e.id_estacion, label: e.nombre_estacion }));
        const lineaCodes = lineaOptions.map((o) => o.value);
        const estacionCodes = estacionOptions.map((o) => o.value);
        return FIELDS.map((field) => {
            if (field.key === 'id_linea') {
                return { ...field, options: lineaOptions, accept: (v: string) => isCodePrefix(v, lineaCodes) };
            }
            if (field.key === 'id_estacion') {
                return { ...field, options: estacionOptions, accept: (v: string) => isCodePrefix(v, estacionCodes) };
            }
            if (field.key === 'id_taquilla') return { ...field, options: taquillaOptions };
            if (field.key === 'turno') return { ...field, options: turnoOptions };
            return field;
        });
    }, [lineas, estaciones, rows, form.id_linea, form.id_estacion, idLinea, idEstacion, idTaquilla, linea]);

    const taquillaChange = keyChange(['id_linea', 'id_estacion', 'id_taquilla', 'turno'], (f) => {
        if (!f.id_taquilla) return undefined;
        const id = taquillaCode(f.id_linea, f.id_estacion, f.id_taquilla);
        const matches = rows.filter((r) => r.id_taquilla === id);
        return f.turno ? matches.find((r) => r.turno === f.turno) : matches[0];
    });

    const openOperacionPdf = () => {
        const asignadas = new Set(enOperacion.map((r) => `${r.id_taquilla}|${r.turno}`));
        openPdf({
            title: 'CATÁLOGO DE TAQUILLAS EN OPERACIÓN (ULTIMO ROL)',
            footerTitle: 'RptCatTaquillas',
            columns: operacionColumns,
            rows: rows.filter((r) => r.id_taquilla !== '00000' && asignadas.has(`${r.id_taquilla}|${r.turno}`)),
            showCount: false,
        });
    };

    const onFieldChange = (key: string, value: string) => {
        const lineaChanged = key === 'id_linea' && padCode(value.toUpperCase()) !== idLinea;
        taquillaChange(key as keyof TaquillaForm, value, lineaChanged ? { id_estacion: '' } : undefined);
    };

    return (
        <CatalogoLayout
            tabLabel="Catálogo de Taquillas y sus Turnos"
            statusLabel="Catálogo de Taquillas"
            count={rows.length}
            onClear={clear}
            {...actions}
            onSave={onSave}
            editing={selected !== null}
            reportActions={
                <button type="button" className="stc-btn stc-generar-reporte-btn" onClick={openOperacionPdf}>
                    Reporte Taquillas en Operacion
                </button>
            }
            reportLabel="Reporte Taquillas y turnos"
            fields={
                <ManualFields
                    fields={fields}
                    form={{
                        ...form,
                        id_taquilla: form.id_taquilla.slice(-1),
                        nombre_linea: lineaName(linea),
                        nombre_estacion: nombreEstacion,
                        nombre_direccion: form.dirdelinea ? direccionName(linea, Number(form.dirdelinea)) : '',
                    }}
                    onChange={onFieldChange}
                />
            }
            pdf={{ title: 'CATÁLOGO DE TAQUILLAS Y TURNOS', ...report, rows: rows.filter((r) => r.id_linea !== '00'), countLabel: 'Taquillas', keepTogether: true, ...TOTAL_EN_RED }}
        >
            <DataTable
                title="Taquillas de la red"
                className="stc-table-taquillas"
                columns={columns}
                rows={rows}
                onRowSelect={fill}
                activeRow={selected as Taquilla | null}
            />
        </CatalogoLayout>
    );
}
