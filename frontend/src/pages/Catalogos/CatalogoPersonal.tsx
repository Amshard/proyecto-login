import { useMemo, useState } from 'react';
import {
    createPersonalTaquilla,
    deletePersonalTaquilla,
    getPersonalTaquilla,
    getRolTaquilla,
    getSinCto,
    type PersonalTaquilla,
    type RolTaquilla,
    updatePersonalTaquilla,
} from '../../api/catalogos';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable, { type Column } from '../../components/DataTable';
import { useBusqueda } from '../../components/useBusqueda';
import { ddmmyyyy, isoDate } from '../../utils/fechas';
import type { PdfReport } from '../../utils/pdf';
import { CamposFila, CamposStack } from './CatalogoCampos';
import {
    catalogoActions,
    codeField,
    dateField,
    expedienteField,
    layoutProps,
    tablaProps,
    textField,
    useCatalogoForm,
    useCatalogoRows,
} from './useCatalogo';

type PersonalForm = Record<keyof PersonalTaquilla, string>;

const EMPTY_FORM: PersonalForm = { id_expediente: '', nombre: '', fecha_ingreso: '', prejubilacion: '', sexo: '' };

const NOMBRE_RE = /^[A-ZÑ ]+$/i;
const notZero = (v: string) => v !== '0';

const FIELDS = [
    { ...expedienteField('id_expediente'), isKey: true, accept: notZero },
    { ...textField('nombre', 'Nombre', 280, { maxLength: 50 }), accept: (v: string) => NOMBRE_RE.test(v) },
    dateField('fecha_ingreso', 'Fecha de Ingreso'),
    {
        ...codeField('prejubilacion', 'Jubilación', 1, { wrap: 90, allowedChars: 'SN' }),
        options: [{ value: 'S', label: 'Sí' }, { value: 'N', label: 'No' }],
    },
    {
        ...codeField('sexo', 'Genero', 1, { wrap: 70, allowedChars: 'FM' }),
        options: [{ value: 'F', label: 'Femenino' }, { value: 'M', label: 'Masculino' }],
    },
];

const ROL_MESSAGE = 'Debe asignar a un Rol disponible';
const ROL_OCUPADO_MESSAGE = 'Esta Posición esta ocupada en el ROL Verifique';

type RolKey = keyof RolTaquilla | '';

const rolField = (key: RolKey, label: string, maxLength: number, width = 50) => ({
    ...codeField(key, label, maxLength, { width, wrap: width + 30 }),
    id: `rol-${key}`,
    readOnly: key !== 'numero',
});

const ROL_FIELDS = [
    { ...rolField('numero', 'Posición en el ROL', 4, 60), inputMode: 'numeric' as const, accept: notZero },
    rolField('id_expediente', 'Expediente', 6, 70),
    rolField('id_tramo', 'Tramo', 5),
    rolField('faltas', 'Faltas', 5),
    rolField('id_taquilla', 'Taquilla', 5),
    rolField('categoria', 'Categoría', 5),
    rolField('id_descansos', 'Descansos', 2),
    rolField('lugar', 'Lugar', 5),
    rolField('calificacion', 'Calificación', 6, 60),
    rolField('turno', 'Turno', 1, 30),
    rolField('id_permanencia', 'Perm.', 1, 30),
];

const rolForm = (numero: string, rol: RolTaquilla | undefined) => {
    const values: Partial<Record<RolKey, unknown>> = { ...rol, numero };
    return Object.fromEntries(ROL_FIELDS.map(({ key }) => [key, String(values[key] ?? '')])) as Record<RolKey, string>;
};

const withDots = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, '.');

const COLUMNS: Column<PersonalTaquilla>[] = [
    { header: 'Expediente', cell: (r) => r.id_expediente },
    { header: 'Nombre', cell: (r) => r.nombre, left: true },
    { header: 'Fecha de Ingreso', cell: (r) => r.fecha_ingreso },
    { header: 'Prejubilación', cell: (r) => r.prejubilacion },
    { header: 'Genero', cell: (r) => r.sexo },
];

const PDF_HEADERS: Record<string, string> = { 'Fecha de Ingreso': 'Fecha Ingreso', Prejubilación: 'Pre-Jub', FoM: 'Genero' };

const byNombre = (a: PersonalTaquilla, b: PersonalTaquilla) => (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es');

const REPORTS: Record<string, { subtitle: string; rows: (rows: PersonalTaquilla[]) => PersonalTaquilla[] }> = {
    'Por Expediente': {
        subtitle: 'Clasificado por Expediente',
        rows: (rows) => [...rows].sort((a, b) => a.id_expediente - b.id_expediente),
    },
    Alfabetico: { subtitle: 'Clasificado Alfabéticamente', rows: (rows) => [...rows].sort(byNombre) },
    'En Prejubilación': {
        subtitle: 'En Prejubilacion',
        rows: (rows) => rows.filter((r) => r.prejubilacion === 'S').sort(byNombre),
    },
};
const REPORT_OPTIONS = Object.keys(REPORTS);

const focusField = (id: string) => setTimeout(() => document.getElementById(id)?.focus());

export default function CatalogoPersonal() {
    const [rows, setRows] = useCatalogoRows(getPersonalTaquilla);
    const [rolRows, setRolRows] = useCatalogoRows(getRolTaquilla);
    const [sinCtoRows] = useCatalogoRows(getSinCto);
    const [numero, setNumero] = useState('');
    const [showRol, setShowRol] = useState(false);
    const busqueda = useBusqueda(rows);
    const [reportOption, setReportOption] = useState(REPORT_OPTIONS[0]);

    const maxDate = isoDate();
    const minDate = rows.reduce<string | undefined>((oldest, r) => {
        const fecha = String(r.fecha_ingreso ?? '').slice(0, 10);
        return fecha && (!oldest || fecha < oldest) ? fecha : oldest;
    }, undefined);

    const catalogoForm = useCatalogoForm(EMPTY_FORM, {
        required: showRol ? ['id_expediente', 'nombre', 'fecha_ingreso', 'prejubilacion', 'sexo'] : ['id_expediente'],
        noUpper: ['fecha_ingreso'],
        fields: FIELDS,
        checks: {
            id_expediente: (v) => (Number(v) >= 1 ? undefined : 'El campo Expediente debe ser un número mayor a 0.'),
            nombre: (v) => (NOMBRE_RE.test(v) ? undefined : 'El campo Nombre solo puede contener letras y espacios.'),
            fecha_ingreso: (v) => {
                if (v > maxDate) return 'El campo Fecha de Ingreso no puede ser posterior a la fecha actual.';
                if (minDate && v < minDate) return `El campo Fecha de Ingreso no puede ser anterior al ${ddmmyyyy(minDate)}.`;
            },
        },
    });
    const { form, selected, clear, keyChange, validate } = catalogoForm;

    const rol = rolRows.find((r) => String(r.numero) === numero);
    const patchRol = (match: (r: RolTaquilla) => boolean, changes: Partial<RolTaquilla>) =>
        setRolRows((prev) => prev.map((r) => (match(r) ? { ...r, ...changes } : r)));

    const actions = catalogoActions(setRows, catalogoForm, (f) => ({
        id_expediente: Number(f.id_expediente),
        nombre: f.nombre || null,
        fecha_ingreso: f.fecha_ingreso || null,
        prejubilacion: f.prejubilacion || null,
        sexo: f.sexo || null,
    }), {
        create: (row) => createPersonalTaquilla(row, Number(numero)),
        update: updatePersonalTaquilla,
        remove: async (row) => {
            await deletePersonalTaquilla(row.id_expediente);
            patchRol((r) => r.id_expediente === row.id_expediente, { id_expediente: 0, faltas: 0, calificacion: '0.00' });
        },
    });
    const onExpedienteEnter = (value: string) => {
        if (!value) return window.alert('El campo Expediente está vacío.');
        if (Number(value) < 1) return window.alert('El campo Expediente debe ser un número mayor a 0.');
        if (!rows.some((r) => String(r.id_expediente) === value)) void onSave();
    };
    const fields = FIELDS.map((f) => {
        if (f.key === 'fecha_ingreso') return { ...f, minDate, maxDate };
        if (f.key === 'id_expediente') return { ...f, onEnter: onExpedienteEnter };
        return f;
    });

    const onFieldChange = keyChange(['id_expediente'], (f) => rows.find((r) => String(r.id_expediente) === f.id_expediente));

    const hideRol = () => {
        setNumero('');
        setShowRol(false);
    };

    const onSave = async () => {
        if (!validate()) return false;
        if (!showRol) {
            if (window.confirm('El Expediente no existe ¿Desea agregarlo?')) {
                setShowRol(true);
                focusField('rol-numero');
            } else {
                focusField('filtro-id_expediente');
            }
            return false;
        }
        if (rol?.id_expediente !== 0) {
            window.alert(rol ? ROL_OCUPADO_MESSAGE : ROL_MESSAGE);
            return false;
        }
        if (!(await actions.onSave())) return false;
        patchRol((r) => r.numero === rol.numero, { id_expediente: Number(form.id_expediente) });
        hideRol();
        return true;
    };

    const displayedRows = useMemo(
        () => [...busqueda.filtradas].sort((a, b) => Number(a.id_expediente) - Number(b.id_expediente)),
        [busqueda.filtradas]
    );

    const tableColumns = useMemo<Column<PersonalTaquilla>[]>(() => {
        const regOf = new Map(displayedRows.map((row, i) => [row, i + 1]));
        return [{ header: 'Reg', cell: (r) => regOf.get(r), center: true }, ...COLUMNS];
    }, [displayedRows]);

    const report = REPORTS[reportOption];
    const pdfRows = report.rows(displayedRows);
    const repOf = new Map(pdfRows.map((row, i) => [row, withDots(i + 1)]));
    const sinCtoOf = new Map(sinCtoRows.map((r) => [r.id_expediente, r.sincto]));
    const pdf: PdfReport<PersonalTaquilla> = {
        title: 'PERSONAL DE TAQUILLA',
        subtitle: report.subtitle,
        footerTitle: 'RptPersonalTaq',
        columns: [
            { header: 'Reg', cell: (r) => repOf.get(r), fit: true },
            ...COLUMNS.map((c) => ({ ...c, header: PDF_HEADERS[c.header] ?? c.header })),
            { header: 'Provcnal', cell: (r) => sinCtoOf.get(r.id_expediente) },
        ],
        rows: pdfRows,
        countText: (r) => `Total de ${withDots(r.length)} Expedientes en el Catálogo del Personal de Taquilla`,
        countBold: true,
        countUnderline: false,
        sortById: false,
        centered: true,
        oneLineHeaders: true,
        rowPadding: 2.5,
        columnPadding: 2,
    };

    return (
        <CatalogoLayout
            tabLabel="Personal de Taquilla"
            statusLabel="Catalogo Personal de Taquilla"
            reportTitle="Catálogo de Personal de Taquilla"
            {...layoutProps(rows, catalogoForm, actions)}
            onClear={() => {
                clear();
                hideRol();
            }}
            onSave={onSave}
            actions={busqueda.boton}
            fields={
                <CamposStack>
                    <CamposFila fields={fields} form={form} onChange={onFieldChange} />
                    <CamposFila
                        rol
                        oculto={!showRol || selected !== null}
                        fields={ROL_FIELDS.map((f) => (f.key === 'numero' ? { ...f, onEnter: () => void onSave() } : f))}
                        form={rolForm(numero, rol)}
                        onChange={(key, value) => key === 'numero' && setNumero(value)}
                    />
                </CamposStack>
            }
            overlay={busqueda.overlay}
            reportActions={
                <div className="stc-report-option-list">
                    {REPORT_OPTIONS.map((label) => (
                        <label key={label} className="stc-report-option">
                            <input
                                type="radio"
                                name="reporte-personal"
                                checked={reportOption === label}
                                onChange={() => setReportOption(label)}
                            />
                            {label}
                        </label>
                    ))}
                </div>
            }
            pdf={pdf}
        >
            <DataTable
                title="Personal"
                className="stc-table-personal stc-table-narrow"
                rowHeader
                columns={tableColumns}
                rows={displayedRows}
                {...tablaProps<PersonalTaquilla>(catalogoForm)}
            />
        </CatalogoLayout>
    );
}
