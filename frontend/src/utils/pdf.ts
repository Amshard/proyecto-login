import { jsPDF } from 'jspdf';
import autoTable, { type UserOptions } from 'jspdf-autotable';
import type { Column } from '../components/DataTable';
import cdmxLogo from '../assets/cdmx2.jpg?inline';
import stcLogo from '../assets/stc.png?inline';

const LOGO_TOP = 10;
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = (LOGO_WIDTH * 463) / 1504 + 5;
const STC_LOGO_HEIGHT = LOGO_HEIGHT + 5;
const STC_LOGO_WIDTH = (STC_LOGO_HEIGHT * 369) / 150;

function cellText<R>(column: Column<R>, row: R): string {
    const value = column.cell(row);
    return value === null || value === undefined ? '' : String(value);
}

export interface PdfGroup<R> {
    key: (row: R) => string;
    label: (key: string) => string;
    total: (key: string, count: number) => string;
}

export interface CatalogoPdfOptions<R> {
    countLabel?: string;
    countTitle?: string;
    noteLabel?: string;
    noteById?: boolean;
    countBold?: boolean;
    countUnderline?: boolean;
    countUnderlineSplit?: boolean;
    titleBold?: boolean;
    // Space above and below the text of each body row.
    rowPadding?: number;
    group?: PdfGroup<R>;
    unofficialNotes?: boolean;
}

// Same-length codes sort by plain character order so digits come before letters (09 < 0A < 0B < 12);
// codes of different lengths sort numerically (2 < 10).
const byCode = (a: string, b: string) =>
    a.length === b.length
        ? a < b ? -1 : a > b ? 1 : 0
        : a.localeCompare(b, undefined, { numeric: true });

const GROUP_TABLE_TOP = 76;

export function buildCatalogoPdfBlob<R>(
    title: string,
    columns: Column<R>[],
    rows: R[],
    { countLabel = 'Registros', countTitle = countLabel, noteLabel = countLabel, noteById = false, countBold = false, countUnderline = !countBold, countUnderlineSplit = false, titleBold = true, rowPadding = 4, group, unofficialNotes = true }: CatalogoPdfOptions<R> = {}
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
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('SUBDIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS', pageCenter, 30, { align: 'center' });
        doc.text('COORDINACIÓN DE TAQUILLAS', pageCenter, 44, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont('helvetica', titleBold ? 'bold' : 'normal');
        doc.text(title, pageCenter, 62, { align: 'center' });
        doc.setFont('helvetica', 'normal');
    };

    const hasTotals = columns.some((c) => c.total);
    const totalsRow = columns.map((c) =>
        c.total ? String(rows.reduce((sum, row) => sum + (Number(cellText(c, row)) || 0), 0)) : ''
    );

    const PDF_FONT_SIZE = 10;
    const fittedWidth = (column: Column<R>) => {
        doc.setFontSize(PDF_FONT_SIZE);
        doc.setFont('helvetica', 'bold');
        let widest = doc.getTextWidth(column.header);
        doc.setFont('helvetica', 'normal');
        rows.forEach((row) => {
            widest = Math.max(widest, doc.getTextWidth(cellText(column, row)));
        });
        return widest + 8 + (column.indent ?? 0);
    };
    const columnStyles = Object.fromEntries(
        columns.flatMap((c, i) => (c.fit ? [[i, { cellWidth: fittedWidth(c) }]] : []))
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
            styles: { fontSize: PDF_FONT_SIZE, cellPadding: 4, lineColor: [0, 0, 0] },
            columnStyles,
            bodyStyles: { cellPadding: { top: rowPadding, right: 4, bottom: rowPadding, left: 4 } },
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
            willDrawCell: ({ section, row, column, cell }) => {
                const pdfColumn = columns[column.index];
                const indent = pdfColumn?.indent ?? 0;
                if (section === 'foot' || (section === 'head' && row.index !== 0)) return;
                let offset = indent;
                if (pdfColumn?.center && section === 'body') {
                    doc.setFontSize(PDF_FONT_SIZE);
                    doc.setFont('helvetica', 'bold');
                    const headerWidth = doc.getTextWidth(pdfColumn.header);
                    doc.setFont('helvetica', 'normal');
                    offset += (headerWidth - doc.getTextWidth(cell.text.join(''))) / 2;
                }
                if (!offset) return;
                cell.styles.cellPadding = {
                    top: cell.padding('top'),
                    right: cell.padding('right'),
                    bottom: cell.padding('bottom'),
                    left: cell.padding('left') + offset,
                };
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
            doc.setFont('helvetica', 'bold');
            doc.text(group.total(key, groupRows.length), pageCenter, totalY, { align: 'center' });
            doc.setFont('helvetica', 'normal');
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
    doc.setFont('helvetica', countBold || countUnderlineSplit ? 'bold' : 'normal');
    doc.text(countLabelText, pageCenter, countLabelY, { align: 'center' });

    const countLabelWidth = doc.getTextWidth(countLabelText);
    const countStartX = pageCenter - countLabelWidth / 2;
    const countEndX = pageCenter + countLabelWidth / 2;
    const countNumberX = countStartX + doc.getTextWidth(`${countTitle}: `);

    if (countUnderline) {
        const doubleUnderline = (startX: number, endX: number) => {
            doc.line(startX, countLabelY + 3, endX, countLabelY + 3);
            doc.line(startX, countLabelY + 5, endX, countLabelY + 5);
        };
        doc.setLineWidth(0.75);
        if (countUnderlineSplit) {
            doubleUnderline(countStartX, countStartX + doc.getTextWidth(countTitle));
            doubleUnderline(countNumberX, countEndX);
        } else {
            doubleUnderline(countStartX, countEndX);
        }
    }
    doc.setFont('helvetica', 'normal');

    let noteY = countLabelY + 20;
    let unofficialCount = 0;
    doc.setFontSize(8);
    doc.setFont('helvetica', countUnderlineSplit ? 'bold' : 'normal');
    if (idColumn && unofficialNotes) {
        rows.forEach((row, index) => {
            if (!/^0+$/.test(cellText(idColumn, row).trim())) return;
            unofficialCount += 1;
            if (noteY > pageHeight - 50) {
                doc.addPage();
                noteY = 40;
            }
            doc.text(
                `Menos ${unofficialCount} por la ${noteLabel} ${noteById ? cellText(idColumn, row).trim() : index + 1} que no es oficial`,
                countUnderlineSplit ? countNumberX : pageCenter,
                noteY,
                { align: countUnderlineSplit ? 'left' : 'center' }
            );
            noteY += 12;
        });
    }
    doc.setFont('helvetica', 'normal');

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
