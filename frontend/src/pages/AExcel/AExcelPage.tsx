import { useState } from 'react';
import CatalogoLayout from '../../components/CatalogoLayout';
import { RadioOption, SideButtons } from '../Procesos/ProcesoControls';
import ProgressBar from '../Procesos/ProgressBar';
import '../Procesos/Procesos.css';
import './AExcel.css';

export interface CampoExcel {
    label: string;
    digitos: number;
}

export interface OpcionExcel {
    label: string;
    campos?: CampoExcel[];
    titulo?: string;
    boton?: string;
}

const ANIO: CampoExcel = { label: 'Año', digitos: 4 };

interface AExcelPageProps {
    opcion: string;
    anio?: boolean;
    opciones?: OpcionExcel[];
}

export default function AExcelPage({ opcion, anio = true, opciones }: AExcelPageProps) {
    const lista = opciones ?? [{ label: opcion, campos: anio ? [ANIO] : [] }];
    const [elegida, setElegida] = useState<number | null>(null);
    const [valores, setValores] = useState<Record<string, string>>({});
    const [mensaje] = useState('');

    const campo = (c: CampoExcel, i: number, j: number) => {
        const key = `${i}-${j}`;
        return (
            <label key={key} className="stc-aexcel-campo">
                {c.label && <span className="stc-field-label">{c.label}</span>}
                <input
                    className="stc-field-input stc-aexcel-input"
                    inputMode="numeric"
                    maxLength={c.digitos}
                    value={valores[key] ?? ''}
                    onChange={(e) => setValores((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, '') }))}
                />
            </label>
        );
    };

    const radio = (op: OpcionExcel, i: number) => (
        <RadioOption key={op.label} label={op.label} checked={elegida === i} onCheck={() => setElegida(i)} />
    );

    return (
        <CatalogoLayout
            tabLabel={opcion.toUpperCase()}
            hideTabs
            pageClassName="stc-para-calificacion"
            statusLabel="Menú A Excel"
            count={0}
            actions={elegida !== null && <SideButtons buttons={[{ label: lista[elegida].boton ?? 'Genera en Excel' }]} />}
        >
            <fieldset className="stc-report-options stc-rol-options stc-rol-options-wide">
                <legend className="stc-report-options-title">A Excel</legend>
                {lista.length > 1 ? (
                    <>
                        <div className="stc-aexcel-fila stc-aexcel-radios">{lista.map(radio)}</div>
                        <div className="stc-aexcel-fila">
                            {lista.map((op, i) =>
                                op.campos?.length ? (
                                    <div key={op.label} className="stc-aexcel-grupo">
                                        {op.titulo && <span className="stc-field-label">{op.titulo}</span>}
                                        <div className="stc-aexcel-campos">{op.campos.map((c, j) => campo(c, i, j))}</div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </>
                ) : (
                    lista.map((op, i) => (
                        <div key={op.label} className="stc-aexcel-fila">
                            {op.campos?.map((c, j) => campo(c, i, j))}
                            {radio(op, i)}
                        </div>
                    ))
                )}
                <ProgressBar value={0} />
                <input
                    className="stc-field-input stc-aexcel-ancho"
                    aria-label="Mensaje"
                    readOnly
                    tabIndex={-1}
                    value={mensaje}
                />
            </fieldset>
        </CatalogoLayout>
    );
}
