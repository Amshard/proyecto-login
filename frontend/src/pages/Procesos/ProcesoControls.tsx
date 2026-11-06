import type { InputHTMLAttributes } from 'react';
import { digitWidth, onlyDigits, replaceAt, type RolFechas } from './procesoFields';
import ProgressBar from './ProgressBar';

interface SideButton {
    label: string;
    onClick?: () => void;
    className?: string;
}

export function SideButtons({ buttons }: { buttons: SideButton[] }) {
    return (
        <>
            {buttons.map(({ label, onClick, className }) => (
                <button
                    key={label}
                    type="button"
                    className={`stc-btn stc-exit-btn${className ? ` ${className}` : ''}`}
                    onClick={onClick}
                >
                    {label}
                </button>
            ))}
        </>
    );
}

interface RadioOptionProps {
    label: string;
    checked: boolean;
    onCheck: () => void;
    disabled?: boolean;
}

export function RadioOption({ label, checked, onCheck, disabled }: RadioOptionProps) {
    return (
        <label className={`stc-report-option stc-proceso-radio${disabled ? ' stc-radio-bloqueado' : ''}`}>
            <input type="radio" checked={checked} onChange={onCheck} disabled={disabled} />
            {label}
        </label>
    );
}

interface RadioOptionsProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    disabled?: string[];
}

export function RadioOptions({ options, value, onChange, disabled }: RadioOptionsProps) {
    return (
        <>
            {options.map((label) => (
                <RadioOption
                    key={label}
                    label={label}
                    checked={value === label}
                    onCheck={() => onChange(label)}
                    disabled={disabled?.includes(label)}
                />
            ))}
        </>
    );
}

type DigitInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    label: string;
    digitos: number;
    value: string;
    onChange: (value: string) => void;
    fit?: boolean;
};

export function DigitInput({ label, digitos, value, onChange, fit = true, className, style, ...rest }: DigitInputProps) {
    return (
        <input
            {...rest}
            className={`stc-field-input stc-digit-input${className ? ` ${className}` : ''}`}
            aria-label={label}
            inputMode="numeric"
            maxLength={digitos}
            style={fit ? { ...digitWidth(digitos), ...style } : style}
            value={value}
            onChange={(e) => onChange(onlyDigits(e.target.value))}
        />
    );
}

interface RolesFechasProps {
    fechasTitulo: string;
    lineas: RolFechas[];
    onChange: (lineas: RolFechas[]) => void;
    juntos?: boolean;
}

/** Gray square with a Rol box and two dates per line, followed by the progress bar. */
export function RolesFechas({ fechasTitulo, lineas, onChange, juntos }: RolesFechasProps) {
    const cambiar = (linea: number, cambio: Partial<RolFechas>) =>
        onChange(replaceAt(lineas, linea, { ...lineas[linea], ...cambio }));

    const columnas = (
        <>
            <div className="stc-manual-field stc-rango-set">
                <span className="stc-field-label">Rol</span>
                <div className="stc-rango-columna">
                    {lineas.map(({ rol }, linea) => (
                        <DigitInput
                            key={linea}
                            label={`Rol ${linea + 1}`}
                            digitos={1}
                            value={rol}
                            onChange={(value) => cambiar(linea, { rol: value })}
                        />
                    ))}
                </div>
            </div>
            <div className="stc-manual-field stc-rango-set">
                <span className="stc-field-label">{fechasTitulo}</span>
                <div className="stc-rango-columna">
                    {lineas.map(({ fechas }, linea) => (
                        <div key={linea} className="stc-rango-cajas">
                            {fechas.map((fecha, caja) => (
                                <input
                                    key={caja}
                                    type="date"
                                    className="stc-field-input stc-rango-fecha"
                                    aria-label={`Fecha ${caja + 1} del Rol ${linea + 1}`}
                                    value={fecha}
                                    onChange={(e) => cambiar(linea, { fechas: replaceAt(fechas, caja, e.target.value) })}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <div className="stc-manual-fields stc-rango-lineas">
            <div className="stc-rango-outline">
                {juntos ? <div className="stc-rango-par">{columnas}</div> : columnas}
                <ProgressBar value={0} />
            </div>
        </div>
    );
}
