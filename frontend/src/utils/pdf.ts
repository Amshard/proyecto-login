import { jsPDF } from 'jspdf';
import autoTable, { type UserOptions } from 'jspdf-autotable';
import type { Column } from '../components/DataTable';
import cdmxLogo from '../assets/cdmx2.jpg?inline';
import stcLogo from '../assets/stc.png?inline';

const LOGO_TOP = 10;
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = (LOGO_WIDTH * 463) / 1504;
const STC_LOGO_HEIGHT = LOGO_HEIGHT + 5;
const STC_LOGO_WIDTH = (STC_LOGO_HEIGHT * 369) / 150;

function cellText<R>(column: Column<R>, row: R): string {
    const value = column.cell(row);
    return value === null || value === undefined ? '' : String(value);
}

// Splits the report by a key: each group starts on a new page, with its label under the column
// titles and its total under its rows.
export interface PdfGroup<R> {
    key: (row: R) => string;
    label: (key: string) => string;
    total: (key: string, count: number) => string;
}

export interface CatalogoPdfOptions<R> {
    countLabel?: string;
    countTitle?: string;
    group?: PdfGroup<R>;
    // Notes under the count for every row whose id is all zeros.
    unofficialNotes?: boolean;
}

const byCode = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

const GROUP_TABLE_TOP = 78;

export function buildCatalogoPdfBlob<R>(
    title: string,
    columns: Column<R>[],
    rows: R[],
    { countLabel = 'Registros', countTitle = countLabel, group, unofficialNotes = true }: CatalogoPdfOptions<R> = {}
): Blob {
    const idColumn = columns[0];
    rows = [...rows].sort(
        (a, b) =>
            (group ? byCode(group.key(a), group.key(b)) : 0) ||
            (idColumn ? byCode(cellText(idColumn, a), cellText(idColumn, b)) : 0)
    );

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });

    const pageCenter = doc.internal.pageSize.getWidth() / 2;

    const drawHeader = () => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('SUBDIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS', pageCenter, 30, { align: 'center' });
        doc.text('COORDINACIÓN DE TAQUILLAS', pageCenter, 44, { align: 'center' });
        doc.setFontSize(13);
        doc.text(title, pageCenter, 66, { align: 'center' });
    };

    const hasTotals = columns.some((c) => c.total);
    const totalsRow = columns.map((c) =>
        c.total ? String(rows.reduce((sum, row) => sum + (Number(cellText(c, row)) || 0), 0)) : ''
    );

    const drawTable = (tableRows: R[], showTotals: boolean, options: Partial<UserOptions>, label?: string) =>
        autoTable(doc, {
            theme: 'plain',
            head: [
                columns.map((c) => c.header),
                ...(label
                    ? [[{ content: label, colSpan: columns.length, styles: { fontSize: 10, lineWidth: 0 } }]]
                    : []),
            ],
            body: tableRows.map((row) => columns.map((c) => cellText(c, row))),
            foot: hasTotals && showTotals ? [totalsRow] : undefined,
            showFoot: 'lastPage',
            styles: { fontSize: 8, cellPadding: 4, lineColor: [0, 0, 0] },
            headStyles: {
                fillColor: false,
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: { top: 1, bottom: 1, left: 0, right: 0 },
                lineColor: [0, 0, 0],
            },
            footStyles: {
                fillColor: false,
                textColor: [0, 0, 0],
                fontStyle: 'normal',
                fontSize: 9,
                cellPadding: { top: 8, right: 4, bottom: 4, left: 4 },
                lineWidth: 0,
            },
            didDrawCell: ({ section, cell }) => {
                const text = cell.text.join('');
                if (section !== 'foot' || !text) return;
                doc.setFontSize(20);
                const startX = cell.x + cell.padding('right');
                const endX = startX + doc.getTextWidth(text);
                doc.setLineWidth(0.75);
                doc.line(startX, cell.y + 1, endX, cell.y + 1);
                doc.line(startX, cell.y + 3, endX, cell.y + 3);
            },
            margin: { left: 20, right: 20 },
            ...options,
        });

    const pageHeight = doc.internal.pageSize.getHeight();
    const lastTableY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    let finalY: number;

    if (group) {
        const groups = new Map<string, R[]>();
        rows.forEach((row) => {
            const key = group.key(row);
            groups.set(key, [...(groups.get(key) ?? []), row]);
        });
        [...groups].forEach(([key, groupRows], index) => {
            if (index > 0) doc.addPage();
            drawTable(
                groupRows,
                index === groups.size - 1,
                {
                    startY: GROUP_TABLE_TOP,
                    margin: { left: 20, right: 20, top: GROUP_TABLE_TOP },
                    // Also runs on the pages a long group spills onto.
                    didDrawPage: drawHeader,
                },
                group.label(key)
            );
            let totalY = lastTableY() + 18;
            if (totalY > pageHeight - 50) {
                doc.addPage();
                drawHeader();
                totalY = GROUP_TABLE_TOP + 10;
            }
            doc.setFontSize(9);
            doc.text(group.total(key, groupRows.length), 24, totalY);
            finalY = totalY;
        });
        finalY ??= lastTableY();
    } else {
        drawHeader();
        drawTable(rows, true, { startY: 78 });
        finalY = lastTableY();
    }

    const countLabelText = `${countTitle}: ${rows.length}`;
    const countLabelY = finalY + 18;
    doc.setFontSize(9);
    doc.text(countLabelText, pageCenter, countLabelY, { align: 'center' });

    const countLabelWidth = doc.getTextWidth(countLabelText);
    const underlineStartX = pageCenter - countLabelWidth / 2;
    const underlineEndX = pageCenter + countLabelWidth / 2;
    doc.setLineWidth(0.75);
    doc.line(underlineStartX, countLabelY + 3, underlineEndX, countLabelY + 3);
    doc.line(underlineStartX, countLabelY + 5, underlineEndX, countLabelY + 5);

    let noteY = countLabelY + 20;
    let unofficialCount = 0;
    doc.setFontSize(8);
    if (idColumn && unofficialNotes) {
        rows.forEach((row, index) => {
            if (!/^0+$/.test(cellText(idColumn, row).trim())) return;
            unofficialCount += 1;
            if (noteY > pageHeight - 50) {
                doc.addPage();
                noteY = 40;
            }
            doc.text(
                `Menos ${unofficialCount} por la ${countLabel} ${index + 1} que no es oficial`,
                pageCenter,
                noteY,
                { align: 'center' }
            );
            noteY += 12;
        });
    }

    const now = new Date();
    const generatedAt = `${now.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })} ${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

    const pageWidth = doc.internal.pageSize.getWidth();
    const footerY = pageHeight - 20;
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(stcLogo, 'PNG', 20, LOGO_TOP, STC_LOGO_WIDTH, STC_LOGO_HEIGHT);
        doc.addImage(cdmxLogo, 'JPEG', pageWidth - 20 - LOGO_WIDTH, LOGO_TOP, LOGO_WIDTH, LOGO_HEIGHT);
        doc.setFontSize(8);
        doc.text(title, 40, footerY);
        doc.text(`FECHA: ${generatedAt}`, pageCenter, footerY, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, footerY, { align: 'right' });
    }

    return doc.output('blob');
}
