import type { ReactNode } from 'react';
import { ManualFields, type ManualFieldConfig } from '../../components/ManualField';
import { fieldLines } from './useCatalogo';
import './Catalogos.css';

// Every box on the Catálogos pages has the same height.
const ALTO_CAJA = 36;

const conAlto = <T extends string>(field: ManualFieldConfig<T>): ManualFieldConfig<T> => ({
    ...field,
    inputStyle: { ...field.inputStyle, height: ALTO_CAJA },
});

interface CamposProps<T extends string> {
    fields: ManualFieldConfig<T>[];
    form: Record<T, string>;
    onChange: (key: T, value: string) => void;
    lockValues?: boolean;
}

interface CamposOutlineProps<T extends string> extends CamposProps<T> {
    // The square spans the whole strip instead of the shared narrow width.
    completo?: boolean;
    // One square per line of boxes, each line ending at a field with breakAfter.
    porLinea?: boolean;
}

// The gray strip above the table, with its boxes inside square outlines.
export function CamposOutline<T extends string>({ fields, completo, porLinea, ...props }: CamposOutlineProps<T>) {
    return (
        <div className="stc-manual-fields">
            {(porLinea ? fieldLines(fields) : [fields]).map((linea) => (
                <ManualFields
                    key={linea[0].key}
                    {...props}
                    className={`stc-campos-outline${completo ? '' : ' stc-campos-narrow'}`}
                    fields={linea.map(conAlto)}
                />
            ))}
        </div>
    );
}

// The gray strip with one square around several rows of boxes (CamposFila).
export function CamposStack({ children }: { children: ReactNode }) {
    return (
        <div className="stc-manual-fields">
            <div className="stc-campos-outline stc-campos-stack">{children}</div>
        </div>
    );
}

interface CamposFilaProps<T extends string> extends CamposProps<T> {
    // The Rol row under the main boxes.
    rol?: boolean;
    // Keeps the row's space but hides its boxes.
    oculto?: boolean;
}

export function CamposFila<T extends string>({ fields, rol, oculto, ...props }: CamposFilaProps<T>) {
    const className = ['stc-manual-fields', rol && 'stc-rol-fields', oculto && 'stc-rol-fields-hidden'].filter(Boolean).join(' ');
    return <ManualFields {...props} className={className} fields={fields.map(conAlto)} />;
}
