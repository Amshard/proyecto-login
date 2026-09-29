// Shared lookups so the navbar and the left button column can hand keyboard focus to each other.

export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const navbarTopButtons = () =>
    Array.from(
        document.querySelectorAll<HTMLButtonElement>(
            '.stc-navbar > .stc-nav-item > .stc-nav-btn, .stc-navbar > .stc-nav-btn',
        ),
    );

// The column of action buttons on the left of the header, top to bottom as they appear on screen.
export const sideButtons = () =>
    Array.from(document.querySelectorAll<HTMLButtonElement>('.stc-header > button:not(:disabled)')).sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );
