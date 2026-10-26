import { useLayoutEffect, useRef } from 'react';

export function useAlignButton(show: boolean) {
    const targetRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const button = buttonRef.current;
        const target = targetRef.current;
        if (!show || !button || !target) return;
        const align = () => {
            const box = target.getBoundingClientRect();
            const parentTop = button.offsetParent?.getBoundingClientRect().top ?? 0;
            button.style.top = `${box.top + box.height / 2 - parentTop}px`;
        };
        align();
        const observer = new ResizeObserver(align);
        observer.observe(document.body);
        window.addEventListener('resize', align);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', align);
        };
    }, [show]);

    return { targetRef, buttonRef };
}
