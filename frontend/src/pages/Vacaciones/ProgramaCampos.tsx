import { ManualFields } from '../../components/ManualField';
import { campoIzq, numero, useForm } from '../Procesos/procesoFields';
import './Vacaciones.css';

const FIELDS = [
    numero('anio', 'Año', 4, 60),
    numero('con_solicitud', 'Con Solicitud', 5, 70),
    numero('periodos', 'Periodos', 2, 60),
    numero('sin_solicitud', 'Sin Solicitud', 5, 70),
].map(campoIzq);

const CON_PREJUBILADOS = [...FIELDS, campoIzq(numero('prejubilados', 'Prejubilados', 5, 70))];

export default function ProgramaCampos({ prejubilados }: { prejubilados?: boolean }) {
    const fields = prejubilados ? CON_PREJUBILADOS : FIELDS;
    const [form, setField] = useForm(CON_PREJUBILADOS);
    return (
        <ManualFields
            className={`stc-vacaciones-campos${prejubilados ? ' stc-vacaciones-prejubilados' : ''}`}
            fields={fields}
            form={form}
            onChange={setField}
        />
    );
}
