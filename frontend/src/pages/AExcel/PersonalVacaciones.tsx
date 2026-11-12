import AExcelPage, { type CampoExcel, type OpcionExcel } from './AExcelPage';

const RANGO: CampoExcel[] = [
    { label: 'Año', digitos: 5 },
    { label: 'Pdo', digitos: 5 },
];

const OPCIONES: OpcionExcel[] = [
    { label: 'Personal de Taquillas por programa vacacional (Excel)', campos: RANGO },
    {
        label: 'Personal de Taquillas por programa vacacional (Reporte)',
        titulo: 'Programa Inicial y Final',
        boton: 'Ver Reporte',
        campos: RANGO.map((campo) => ({ ...campo, label: '' })),
    },
];

export default function PersonalVacaciones() {
    return <AExcelPage opcion="Personal Vacaciones" opciones={OPCIONES} />;
}
