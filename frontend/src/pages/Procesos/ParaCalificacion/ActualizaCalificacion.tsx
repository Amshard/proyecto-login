import { useState } from 'react';
import CatalogoLayout from '../../../components/CatalogoLayout';
import DataTable from '../../../components/DataTable';
import { DigitInput, RolesFechas, SideButtons } from '../ProcesoControls';
import { NO_ROWS, headersOnly, rolesFechasVacios, useForm } from '../procesoFields';
import '../Procesos.css';

const COLUMNS = headersOnly(['Reg', 'Exp', 'Nombre', 'Lin', 'Tur', 'Lin', 'Tur', 'Tot-Lin', 'Tot-Tur']);

type RangoKey = 'exp_ini' | 'exp_fin' | 'rol_ini' | 'anio_ini' | 'rol_fin' | 'anio_fin';

const RANGOS: { titulo: string; cajas: { key: RangoKey; label: string; digitos: number }[] }[] = [
    {
        titulo: 'Expediente Inicial y Final',
        cajas: [
            { key: 'exp_ini', label: 'Expediente Inicial', digitos: 5 },
            { key: 'exp_fin', label: 'Expediente Final', digitos: 5 },
        ],
    },
    {
        titulo: 'Rol y Año Inicial',
        cajas: [
            { key: 'rol_ini', label: 'Rol Inicial', digitos: 1 },
            { key: 'anio_ini', label: 'Año Inicial', digitos: 4 },
        ],
    },
    {
        titulo: 'Rol y Año Final',
        cajas: [
            { key: 'rol_fin', label: 'Rol Final', digitos: 1 },
            { key: 'anio_fin', label: 'Año Final', digitos: 4 },
        ],
    },
];
const CAJAS = RANGOS.flatMap(({ cajas }) => cajas);

const EMPTY_LINEAS = rolesFechasVacios(2);

export default function ActualizaCalificacion() {
    const [rango, setRango, resetRango] = useForm(CAJAS);
    const [lineas, setLineas] = useState(EMPTY_LINEAS);

    const limpiar = () => {
        resetRango();
        setLineas(EMPTY_LINEAS);
    };

    return (
        <CatalogoLayout
            tabLabel="TECLEA EL RANGO"
            statusLabel="Lineas y Turnos por Expediente Completo"
            hideTabs
            actions={
                <SideButtons
                    buttons={[
                        { label: 'Ver Concentrado' },
                        { label: 'Limpiar', onClick: limpiar },
                        { label: 'Genera en Excel' },
                        { label: 'Ver Reporte' },
                        { label: 'Actualiza Calificacion x Expediente' },
                    ]}
                />
            }
            headerText={<div className="stc-header-registros stc-actualiza-header-text">MUESTRA INFORMACION DE LOS ROLES</div>}
            fields={
                <>
                    <div className="stc-manual-fields">
                        {RANGOS.map(({ titulo, cajas }) => (
                            <div key={titulo} className="stc-manual-field stc-rango-set">
                                <span className="stc-field-label">{titulo}</span>
                                <div className="stc-rango-cajas">
                                    {cajas.map(({ key, label, digitos }) => (
                                        <DigitInput
                                            key={key}
                                            label={label}
                                            digitos={digitos}
                                            value={rango[key]}
                                            onChange={(value) => setRango(key, value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <RolesFechas fechasTitulo="Fechas" lineas={lineas} onChange={setLineas} juntos />
                </>
            }
        >
            <DataTable
                title="Calificaciones por Cambio de Línea y Turno"
                className="stc-table-actualiza"
                rowHeader
                columns={COLUMNS}
                rows={NO_ROWS}
            />
        </CatalogoLayout>
    );
}
