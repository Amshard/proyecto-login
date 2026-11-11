export const isoDate = (date: Date = new Date()) =>
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

export const ddmmyyyy = (iso: string) => iso.split('-').reverse().join('/');

export const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

export const aFecha = (iso: string) => {
    const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
};

export const masDias = (iso: string, dias: number) => {
    const date = aFecha(iso);
    date.setDate(date.getDate() + dias);
    return isoDate(date);
};

export const textoPeriodo = (del: string, al: string) => {
    const [ini, fin] = [aFecha(del), aFecha(al)];
    const mes = (d: Date) => MESES[d.getMonth()];
    if (ini.getFullYear() !== fin.getFullYear())
        return `DEL ${ini.getDate()} DE ${mes(ini)} DE ${ini.getFullYear()} AL ${fin.getDate()} DE ${mes(fin)} DE ${fin.getFullYear()}`;
    if (ini.getMonth() !== fin.getMonth())
        return `DEL ${ini.getDate()} DE ${mes(ini)} AL ${fin.getDate()} DE ${mes(fin)} DE ${fin.getFullYear()}`;
    return `DEL ${ini.getDate()} AL ${fin.getDate()} DE ${mes(fin)} DE ${fin.getFullYear()}`;
};
