import type { ReactNode } from 'react';
import { ManualFields, type ManualFieldConfig } from '../../components/ManualField';
import { sameHeight } from '../Procesos/procesoFields';
import { fieldLines } from './useCatalogo';
import './Catalogos.css';

interface CamposProps<T extends string> {
    fields: ManualFieldConfig<T>[];
    form: Record<T, string>;
    onChange: (key: T, value: string) => void;
    lockValues?: boolean;
}

interface CamposOutlineProps<T extends string> extends CamposProps<T> {
    completo?: boolean;
    porLinea?: boolean;
    titulo?: string;
}

export function CamposOutline<T extends string>({ fields, completo, porLinea, titulo, ...props }: CamposOutlineProps<T>) {
    const angosto = completo ? '' : ' stc-campos-narrow';
    const lineas = (porLinea ? fieldLines(fields) : [fields]).map((linea) => (
        <ManualFields
            key={linea[0].key}
            {...props}
            className={`stc-campos-outline${titulo ? '' : angosto}`}
            fields={linea.map(sameHeight)}
        />
    ));

    return (
        <div className="stc-manual-fields">
            {titulo ? (
                <fieldset className={`stc-campos-titulado${angosto}`}>
                    <legend className="stc-report-options-title">{titulo}</legend>
                    {lineas}
                </fieldset>
            ) : (
                lineas
            )}
        </div>
    );
}

export function CamposStack({ children }: { children: ReactNode }) {
    return (
        <div className="stc-manual-fields">
            <div className="stc-campos-outline stc-campos-stack">{children}</div>
        </div>
    );
}

interface CamposFilaProps<T extends string> extends CamposProps<T> {
    rol?: boolean;
    oculto?: boolean;
}

export function CamposFila<T extends string>({ fields, rol, oculto, ...props }: CamposFilaProps<T>) {
    const className = ['stc-manual-fields', rol && 'stc-rol-fields', oculto && 'stc-rol-fields-hidden'].filter(Boolean).join(' ');
    return <ManualFields {...props} className={className} fields={fields.map(sameHeight)} />;
}
