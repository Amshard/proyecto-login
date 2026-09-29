import { type KeyboardEvent, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ARROW_KEYS, navbarTopButtons, sideButtons } from './keyboardNav';

function slugify(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const NAV_ITEMS = [
    {
        label: 'Catálogos',
        items: [
            'Permanencias',
            'Lineas',
            'Estaciones',
            'Taquillas',
            'Descansos',
            'Personal de Taquilla',
            'Personal Provisional',
        ],
    },
    {
        label: 'Procesos',
        items: [
            'Respalda Rol Vigente',
            'Rol de Descansos',
            { label: 'Para Calificación', items: ['Prepara Expedientes (Para Asignar Incidencias)', 'Carga Incidencias desde Archivos (Excel)', 'Asignación de Indicencias', 'Roles por Turno y Línea (Promedia Calificación)', 'Califica', 'Actualiza Incidencias (X Expediente)', 'Actualiza Calificacion ( X Rango ) Por cambio de Linea-y Turno'] },
            'Cambio de Posiciones en el Rol',
            'Agrega un luga en el Rol',
            'Excel - Concentrado de Lineas-Turnos x Exp',
        ],
    },
    { label: 'Reportes', items: ['Calificaciones', 'Rol Taquilla', 'Categorias en Taquilla', 'Dias Compensados', 'Concentrado para Asistencia', 'Totales del Rol Vigente por Permanencia y Periodos', 'Ventas Boletos, Recargas y Tarjetas'] },
    { label: 'Consultas', items: ['Ubicación por Expediente', 'Calificaciones', 'Periodos Vacacionales por Expediente'] },
    { label: 'Vacaciones', items: ['  Fecha de Captura WEB', 'INICIO ANUAL DE VACACIONES', '  Captura Periodos Vacacionales', 'CAPTURA DE SOLICITUDES', '  Genera Solicitudes Para el Personal Faltante', '  Reporte de Vacaciones Con y Sin Solicitud', 'PROMEDIA CALIFICACIONES', 'GENERA PROG ANUAL DE VACACIONES (Asignacion)', '  Genera Comparativo', '  Reporte Comparativo de Vacaciones Asignadas', ' Reportes del Programa Anual', '  Re-Asigna Periodos Vacacionales por Expediente'] },
    {
        label: 'Utilerías',
        items: [
            'Usuarios',
            { label: 'Parámetros Para Calificación', items: ['Antiguedad STC', 'Asistencia (Faltas)', 'Puntualidad (Retardos)', 'Roles en la Línea y en el Turno', 'Faltante de Efectivo', 'Fecuencia FE', 'Sanciones'] },
            'Cambia de Rol y Captura Roles en el Año',
            'Captura Catorcenas del año',
        ],
    },
    { label: 'A Excel', items: ['Personal de Taquilla', 'Calificaciones', 'Personal_vacaciones', 'Rol vigente para Dias Economicos', 'Respalda Personal de Taquilla', 'Respalda Calificaciones'] },
];

const listButtons = (list: Element) =>
    Array.from(list.querySelectorAll<HTMLButtonElement>(':scope > li > .stc-submenu-btn'));

export default function Navbar() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const closeMenus = () => {
        setOpenMenu(null);
        setOpenSubMenu(null);
    };

    const go = (path: string, state: Record<string, string>) => {
        closeMenus();
        navigate(`/dashboard/${path}`, { state });
    };

    // With nothing focused, any arrow key starts keyboard navigation on the navbar.
    useEffect(() => {
        const onDocumentKeyDown = (e: globalThis.KeyboardEvent) => {
            const active = document.activeElement;
            if (!ARROW_KEYS.includes(e.key) || (active && active !== document.body)) return;
            const first = navbarTopButtons()[0];
            if (!first) return;
            e.preventDefault();
            first.focus();
        };
        document.addEventListener('keydown', onDocumentKeyDown);
        return () => document.removeEventListener('keydown', onDocumentKeyDown);
    }, []);

    // Focuses a top-level button, opening its menu on the first item when it has one.
    const focusTop = (button: HTMLButtonElement, open: boolean) => {
        const menu = button.dataset.menu;
        flushSync(() => {
            setOpenMenu(open && menu ? menu : null);
            setOpenSubMenu(null);
        });
        const list = open && menu ? button.parentElement?.querySelector(':scope > .stc-submenu') : null;
        (list ? listButtons(list)[0] : button)?.focus();
    };

    const openFlyout = (button: HTMLButtonElement) => {
        flushSync(() => setOpenSubMenu(button.dataset.submenu ?? null));
        const flyout = button.parentElement?.querySelector(':scope > .stc-submenu-flyout');
        if (flyout) listButtons(flyout)[0]?.focus();
    };

    // Arrow keys move between menus and items, Enter opens a menu or runs an item, Escape backs out.
    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        const target = e.target;
        if (!(target instanceof HTMLButtonElement)) return;
        const tops = navbarTopButtons();
        const wrap = (i: number) => tops[(i + tops.length) % tops.length];

        const topIndex = tops.indexOf(target);
        if (topIndex >= 0) {
            const side = sideButtons()[0];
            if (e.key === 'ArrowLeft' && topIndex === 0 && side) {
                // Left of the first menu is the button column on the left of the page.
                closeMenus();
                side.focus();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                focusTop(wrap(topIndex + (e.key === 'ArrowRight' ? 1 : -1)), openMenu !== null);
            } else if ((e.key === 'ArrowDown' || e.key === 'Enter') && target.dataset.menu) {
                focusTop(target, true);
            } else if (e.key === 'Escape') {
                closeMenus();
            } else {
                return;
            }
            e.preventDefault();
            return;
        }

        const list = target.closest('ul');
        const topButton = target.closest('.stc-nav-item')?.querySelector<HTMLButtonElement>(':scope > .stc-nav-btn');
        if (!list || !topButton) return;
        const items = listButtons(list);
        const index = items.indexOf(target);
        const inFlyout = list.classList.contains('stc-submenu-flyout');
        const groupButton = inFlyout ? list.parentElement?.querySelector<HTMLButtonElement>(':scope > .stc-submenu-btn') : null;
        const backToGroup = () => {
            flushSync(() => setOpenSubMenu(null));
            groupButton?.focus();
        };

        switch (e.key) {
            case 'ArrowDown':
                items[(index + 1) % items.length]?.focus();
                break;
            case 'ArrowUp':
                items[(index - 1 + items.length) % items.length]?.focus();
                break;
            case 'ArrowRight':
                if (target.dataset.submenu) openFlyout(target);
                else focusTop(wrap(tops.indexOf(topButton) + 1), true);
                break;
            case 'ArrowLeft':
                if (inFlyout) backToGroup();
                else focusTop(wrap(tops.indexOf(topButton) - 1), true);
                break;
            case 'Enter':
                if (!target.dataset.submenu) return; // plain items run through their click handler
                openFlyout(target);
                break;
            case 'Escape':
                if (inFlyout) backToGroup();
                else focusTop(topButton, false);
                break;
            default:
                return;
        }
        e.preventDefault();
    };

    return (
        <nav
            className="stc-navbar"
            onKeyDown={onKeyDown}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMenus();
            }}
        >
            {NAV_ITEMS.map((navItem) => (
                <div key={navItem.label} className="stc-nav-item" onMouseLeave={closeMenus}>
                    <button
                        type="button"
                        className="stc-nav-btn"
                        data-menu={navItem.label}
                        aria-haspopup="menu"
                        aria-expanded={openMenu === navItem.label}
                        onClick={() => setOpenMenu((prev) => (prev === navItem.label ? null : navItem.label))}
                    >
                        {navItem.label}
                    </button>
                    {openMenu === navItem.label && (
                        <ul className="stc-submenu">
                            {navItem.items.map((item, index) => {
                                const group = typeof item === 'string' ? null : item;
                                const label = typeof item === 'string' ? item : item.label;
                                const subMenuKey = `${navItem.label}-${index}`;

                                return (
                                    <li
                                        key={index}
                                        className="stc-submenu-item"
                                        onMouseEnter={group ? () => setOpenSubMenu(subMenuKey) : undefined}
                                        onMouseLeave={group ? () => setOpenSubMenu(null) : undefined}
                                    >
                                        <button
                                            type="button"
                                            className="stc-submenu-btn"
                                            data-submenu={group ? subMenuKey : undefined}
                                            aria-haspopup={group ? 'menu' : undefined}
                                            aria-expanded={group ? openSubMenu === subMenuKey : undefined}
                                            onClick={() =>
                                                group
                                                    ? setOpenSubMenu(subMenuKey)
                                                    : go(`${slugify(navItem.label)}/${slugify(label)}`, {
                                                    title: label,
                                                    section: navItem.label,
                                                })
                                            }
                                        >
                                            {label}
                                            {group && <span className="stc-submenu-arrow">›</span>}
                                        </button>
                                        {group && openSubMenu === subMenuKey && (
                                            <ul className="stc-submenu stc-submenu-flyout">
                                                {group.items.map((subItem) => (
                                                    <li key={subItem}>
                                                        <button
                                                            type="button"
                                                            className="stc-submenu-btn"
                                                            onClick={() =>
                                                                go(
                                                                    `${slugify(navItem.label)}/${slugify(group.label)}/${slugify(subItem)}`,
                                                                    { title: subItem, section: navItem.label, group: group.label },
                                                                )
                                                            }
                                                        >
                                                            {subItem}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            ))}
            <button type="button" className="stc-nav-btn" onClick={() => navigate('/login', { replace: true })}>
                Salir
            </button>
        </nav>
    );
}
