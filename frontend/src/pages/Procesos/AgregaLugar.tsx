import CatalogoLayout from '../../components/CatalogoLayout';
import DataTable from '../../components/DataTable';
import { ManualFields } from '../../components/ManualField';
import { codeField } from '../Catalogos/useCatalogo';
import { SideButtons } from './ProcesoControls';
import { NO_ROWS, fixedField, headersOnly, useForm } from './procesoFields';
import './Procesos.css';

const BUSQUEDA_FIELDS = [
    codeField('caja1', 'Expediente', 5, { width: 60 }),
    codeField('caja2', 'Turno', 2, { width: 20 }),
    codeField('caja3', 'Linea', 2, { width: 20 }),
].map(fixedField);

const DERECHA_FIELDS = [
    codeField('posc_actual', 'Posc Actual', 5, { width: 60, numeric: true }),
    codeField('tramo', 'Tramo', 5, { width: 60 }),
    codeField('sin_titulo', 'ㅤ', 5, { width: 300 }),
    codeField('turno', 'Turno', 1, { width: 20 }),
    codeField('perm', 'Perm', 1, { width: 20 }),
    codeField('jubd', 'Jubd', 1, { width: 20 }),
].map(fixedField);

const FIELDS = [...BUSQUEDA_FIELDS, ...DERECHA_FIELDS];

const COLUMNS = headersOnly([
    'Posicion',
    'Tur',
    'Expediente',
    'Tramo',
    'Ftas',
    'Taquilla',
    'Categoria',
    'Descanso',
    'Lugar',
    'Calificacion',
    'Perm',
    'Cambio',
]);

export default function AgregaLugar() {
    const [form, setField, limpiar] = useForm(FIELDS);

    return (
        <CatalogoLayout
            tabLabel="AGREGA UN LUGAR EN EL ROL"
            statusLabel="Agrega Registro Al Rol de Taquilla"
            actions={
                <SideButtons
                    step={55}
                    buttons={[{ label: 'Limpiar', onClick: limpiar }, { label: 'Ver en Consulta' }, { label: 'Guarda Los Cbios' }]}
                />
            }
            fields={
                <div className="stc-manual-fields stc-agrega-fields">
                    <div className="stc-agrega-busqueda">
                        <p className="stc-agrega-instruccion">Teclee un Expediente para buscar la Linea, Tramo y Turno</p>
                        <ManualFields className="stc-agrega-row" fields={BUSQUEDA_FIELDS} form={form} onChange={setField} />
                    </div>
                    <ManualFields className="stc-agrega-row" fields={DERECHA_FIELDS} form={form} onChange={setField} />
                </div>
            }
        >
            <DataTable title="" className="stc-table-fit" rowHeader columns={COLUMNS} rows={NO_ROWS} />
        </CatalogoLayout>
    );
}
