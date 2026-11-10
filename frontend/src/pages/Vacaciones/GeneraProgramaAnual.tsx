import CatalogoLayout from '../../components/CatalogoLayout';
import { ProgramaContenido } from './ProgramaPage';
import { VER_REPORTE } from './vacacionesFields';

const PESTANAS = [
    { label: 'Programa Vacacional', opcion: 'Asigna Vacaciones' },
    { label: 'Emision de Totales', opcion: 'Reporte de Totales X Periodo y Permanencia' },
    { label: 'Imprime Formula', opcion: 'Programacion de Lugares para Periodos Vacacionales' },
];

export default function GeneraProgramaAnual() {
    const [primera, ...resto] = PESTANAS;

    return (
        <CatalogoLayout
            tabLabel={primera.label}
            statusLabel="Asignación de Vacaciones"
            count={0}
            countOnAllTabs
            extraTabs={resto.map(({ label, opcion }) => ({
                label,
                content: <ProgramaContenido opcion={opcion} />,
                actions: VER_REPORTE,
            }))}
        >
            <ProgramaContenido opcion={primera.opcion} />
        </CatalogoLayout>
    );
}
