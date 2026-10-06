
export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const navbarTopButtons = () =>
    Array.from(
        document.querySelectorAll<HTMLButtonElement>(
            '.stc-navbar > .stc-nav-item > .stc-nav-btn, .stc-navbar > .stc-nav-btn',
        ),
    );

export const sideButtons = () =>
    Array.from(document.querySelectorAll<HTMLButtonElement>('.stc-header > button:not(:disabled)')).sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );
