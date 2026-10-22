import type { PdfReport } from './pdf';

const loadPdf = () => import('./pdf');

export const preloadPdf = () => void loadPdf();

export async function openPdf<R>(report: PdfReport<R>) {
    (await loadPdf()).openPdf(report);
}
