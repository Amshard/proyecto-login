export const isoDate = (date: Date = new Date()) =>
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-');

export const ddmmyyyy = (iso: string) => iso.split('-').reverse().join('/');
