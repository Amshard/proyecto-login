import { useSyncExternalStore } from 'react';

let menuAbierto: string | null = null;
const avisos = new Set<() => void>();

export const setMenuAbierto = (nombre: string | null) => {
    if (nombre === menuAbierto) return;
    menuAbierto = nombre;
    avisos.forEach((avisa) => avisa());
};

const suscribe = (avisa: () => void) => {
    avisos.add(avisa);
    return () => avisos.delete(avisa);
};

export const useMenuAbierto = () => useSyncExternalStore(suscribe, () => menuAbierto);
