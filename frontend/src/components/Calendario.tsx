import { useState } from 'react';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const iso = (date: Date) =>
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

const primeroDelMes = (fecha: string) => {
    const date = fecha ? new Date(`${fecha}T00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

interface CalendarioProps {
    titulo: string;
    value: string;
    onChange: (fecha: string) => void;
    min?: string;
}

export default function Calendario({ titulo, value, onChange, min }: CalendarioProps) {
    const [mes, setMes] = useState(() => primeroDelMes(value));
    const year = mes.getFullYear();
    const month = mes.getMonth();
    const hoy = iso(new Date());
    const vacios = (mes.getDay() + 6) % 7;
    const diasDelMes = new Date(year, month + 1, 0).getDate();
    const mover = (meses: number) => setMes(new Date(year, month + meses, 1));

    return (
        <fieldset className="stc-calendario">
            <legend className="stc-report-options-title">{titulo}</legend>
            <div className="stc-calendario-mes">
                <button type="button" className="stc-calendario-nav" aria-label="Mes anterior" onClick={() => mover(-1)}>
                    ‹
                </button>
                <span>
                    {MESES[month]} {year}
                </span>
                <button type="button" className="stc-calendario-nav" aria-label="Mes siguiente" onClick={() => mover(1)}>
                    ›
                </button>
            </div>
            <div className="stc-calendario-dias">
                {DIAS.map((dia, i) => (
                    <span key={i} className="stc-calendario-semana">
                        {dia}
                    </span>
                ))}
                {Array.from({ length: vacios }, (_, i) => (
                    <span key={`vacio-${i}`} />
                ))}
                {Array.from({ length: diasDelMes }, (_, i) => {
                    const fecha = iso(new Date(year, month, i + 1));
                    const clases = [
                        'stc-calendario-dia',
                        fecha === hoy && 'stc-calendario-hoy',
                        fecha === value && 'stc-calendario-elegido',
                    ];
                    return (
                        <button
                            key={fecha}
                            type="button"
                            className={clases.filter(Boolean).join(' ')}
                            aria-pressed={fecha === value}
                            disabled={min !== undefined && min !== '' && fecha < min}
                            onClick={() => onChange(fecha)}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>
            <div className="stc-calendario-fecha">{value ? value.split('-').reverse().join('/') : 'Sin fecha'}</div>
        </fieldset>
    );
}
