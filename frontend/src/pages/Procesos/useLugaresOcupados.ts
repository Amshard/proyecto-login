import { useCallback, useEffect, useState } from 'react';
import { getLugaresOcupados } from '../../api/catalogos';

/** Occupied rol_taquilla places (id_expediente > 0) for the Registros box, plus a reload for Actualizar.
 * `activo` false skips the load, for a page that shows its own count. */
export function useLugaresOcupados(activo = true) {
    const [ocupados, setOcupados] = useState(0);
    const recarga = useCallback(() => getLugaresOcupados().then(setOcupados), []);

    useEffect(() => {
        if (activo) recarga().catch(() => {});
    }, [activo, recarga]);

    return [ocupados, recarga] as const;
}
