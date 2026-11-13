import { useMemo, useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField } from '../Catalogos/useCatalogo';
import { DigitInput, RadioOptions, RolesFechas, SideButtons } from './ProcesoControls';
import { NO_ROWS, fixedField, headersOnly, replaceAt, rolesFechasVacios, useForm } from './procesoFields';
import './Procesos.css';

const RANGO_FIELDS = [
    codeField('inicial', 'Inicial', 5, { width: 60, numeric: true }),
    codeField('final', 'Final', 5, { width: 60, numeric: true }),
].map(fixedField);

const EMPTY_PARES = [1, 2, 3, 4].map(() => ({ rol: '', anio: '' }));

const OPCIONES = ['Concentrado', 'Detallado x Expediente'];

const EMPTY_LINEAS = rolesFechasVacios(4);

const HEADERS = ['Reg', 'Exp', 'Nombre', 'Lin', 'Tur', 'Lin', 'Tur', 'Lin', 'Tur', 'Lin', 'Tur', 'Lineas', 'Turnos'];
const BASE_COLUMNS = headersOnly(HEADERS);

const TUR_COLUMNS = HEADERS.flatMap((header, i) => (header === 'Tur' ? [i] : []));
const EMPTY_TUR_ROLES = TUR_COLUMNS.map(() => '');

export default function ConcentradoLineas() {
    const [rango, setRangoField, resetRango] = useForm(RANGO_FIELDS);
    const [pares, setPares] = useState(EMPTY_PARES);
    const [opcion, setOpcion] = useState('');
    const [lineas, setLineas] = useState(EMPTY_LINEAS);
    const [turRoles, setTurRoles] = useState(EMPTY_TUR_ROLES);

    const columns = useMemo(
        () =>
            BASE_COLUMNS.map((column, i) => {
                const tur = TUR_COLUMNS.indexOf(i);
                if (tur < 0) return column;
                return {
                    ...column,
                    above: (
                        <label className="stc-table-above-field">
                            Rol
                            <DigitInput
                                label={`Rol ${tur + 1}`}
                                digitos={1}
                                fit={false}
                                value={turRoles[tur]}
                                onChange={(value) => setTurRoles((prev) => replaceAt(prev, tur, value))}
                            />
                        </label>
                    ),
                };
            }),
        [turRoles]
    );

    const setPar = (index: number, key: 'rol' | 'anio', value: string) =>
        setPares((prev) => replaceAt(prev, index, { ...prev[index], [key]: value }));

    const limpiar = () => {
        resetRango();
        setPares(EMPTY_PARES);
        setOpcion('');
        setLineas(EMPTY_LINEAS);
        setTurRoles(EMPTY_TUR_ROLES);
    };

    return (
        <CatalogoLayout
            tabLabel="RANGO DE EXPEDIENTES"
            statusLabel="Rol de Lineas y Turnos por Expediente"
            hideTabs
            actions={
                <SideButtons
                    buttons={[{ label: 'Muestra la Informacion' }, { label: 'Limpiar', onClick: limpiar }, { label: 'Genera en Excel' }]}
                />
            }
            headerText={<div className="stc-header-registros stc-actualiza-header-text">CONCENTRADO POR EXPEDIENTE DE LINEAS Y TURNOS</div>}
            fields={
                <>
                    <div className="stc-manual-fields">
                        <ManualFields className="stc-concentrado-rango" fields={RANGO_FIELDS} form={rango} onChange={setRangoField} />
                        <div className="stc-manual-field stc-rango-set">
                            <span className="stc-field-label">Roles y Años Participantes</span>
                            <div className="stc-concentrado-pares">
                                {pares.map(({ rol, anio }, i) => (
                                    <div key={i} className="stc-rango-cajas">
                                        <DigitInput label={`Rol ${i + 1}`} digitos={1} value={rol} onChange={(v) => setPar(i, 'rol', v)} />
                                        <DigitInput label={`Año ${i + 1}`} digitos={4} value={anio} onChange={(v) => setPar(i, 'anio', v)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="stc-concentrado-opciones">
                            <RadioOptions options={OPCIONES} value={opcion} onChange={setOpcion} />
                        </div>
                    </div>
                    <RolesFechas fechasTitulo="Fechas Seleccionadas" lineas={lineas} onChange={setLineas} />
                </>
            }
        >
            <DataTable title="" className="stc-table-fit" rowHeader columns={columns} rows={NO_ROWS} />
        </CatalogoLayout>
    );
}
