import { jsPDF } from 'jspdf';
import autoTable, { type RowInput, type Styles, type UserOptions } from 'jspdf-autotable';
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

export interface PdfSection<R> {
    key: (row: R) => string;
    label: (row: R) => string;
    total?: (rows: R[]) => string;
    pageBreak?: boolean;
}

export interface PdfReport<R> {
    title: string;
    footerTitle?: string;
    columns: Column<R>[];
    rows: R[];
    countLabel?: string;
    countTitle?: string;
    countText?: (rows: R[]) => string;
    noteLabel?: string;
    noteById?: boolean;
    countBold?: boolean;
    countUnderline?: boolean;
    countUnderlineSplit?: boolean;
    countRule?: boolean;
    countSplitNumber?: boolean;
    titleBold?: boolean;
    rowPadding?: number;
    fontSize?: number;
    rowsAlignWith?: string;
    group?: PdfGroup<R>;
    sections?: PdfSection<R>[];
    keepTogether?: boolean;
    showCount?: boolean;
    unofficialNotes?: boolean;
    inset?: number;
}

const byCode = (a: string, b: string) =>
    a.length === b.length
        ? a < b ? -1 : a > b ? 1 : 0
        : a.localeCompare(b, undefined, { numeric: true });

const GROUP_TABLE_TOP = 76;

type TableLabel = { content: string; styles: Partial<Styles>; fromSection: boolean };

function splitBy<R>(rows: R[], key: (row: R) => string): R[][] {
    const runs: R[][] = [];
    rows.forEach((row, i) => {
        if (i === 0 || key(row) !== key(rows[i - 1])) runs.push([]);
        runs[runs.length - 1].push(row);
    });
    return runs;
}

export function buildCatalogoPdfBlob<R>({
    title,
    footerTitle = title,
    columns,
    rows: unsortedRows,
    countLabel = 'Registros',
    countTitle = countLabel,
    countText,
    noteLabel = countLabel,
    noteById = false,
    countBold = false,
    countUnderline = !countBold,
    countUnderlineSplit = false,
    countRule = false,
    countSplitNumber = false,
    titleBold = true,
    rowPadding = 4,
    fontSize = 10,
    rowsAlignWith,
    group,
    sections = [],
    keepTogether = false,
    showCount = true,
    unofficialNotes = false,
    inset = 0,
}: PdfReport<R>): Blob {
    const idColumn = columns[0];
    const sortKeys = [...(group ? [group.key] : []), ...sections.map((s) => s.key)];
    const rows = [...unsortedRows].sort(
        (a, b) =>
            sortKeys.reduce((order, key) => order || byCode(key(a), key(b)), 0) ||
            (idColumn ? byCode(cellText(idColumn, a), cellText(idColumn, b)) : 0)
    );

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCenter = pageWidth / 2;

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

    const gap = (points: number) => (points * rowPadding) / 4;

    const headingStyle = (level: number) => ({
        fontStyle: 'bold' as const,
        fontSize: level === 0 ? fontSize : fontSize - 1,
        lineWidth: { top: level === 0 ? 0.5 : 0, bottom: 0, left: 0, right: 0 },
        cellPadding: { top: gap(level === 0 ? 10 : 6), right: 4, bottom: gap(3), left: 4 + level * 14 },
    });

    const totalStyle = () => ({
        fontStyle: 'bold' as const,
        fontSize: fontSize - 1,
        halign: 'center' as const,
        cellPadding: { top: gap(3), right: 4, bottom: gap(6), left: 4 },
    });

    const textWidth = (text: string, size: number, style: 'normal' | 'bold') => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        const width = doc.getTextWidth(text);
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        return width;
    };

    const spacerWidth = (() => {
        if (rowsAlignWith === undefined || !sections.length) return 0;
        const heading = headingStyle(sections.length - 1);
        return heading.cellPadding.left + textWidth(rowsAlignWith, heading.fontSize, 'bold') - 4;
    })();
    const leftSpacer = spacerWidth + inset;
    const spacer: Column<R> = { header: '', cell: () => '' };
    const tableColumns: Column<R>[] = [...(leftSpacer ? [spacer] : []), ...columns, ...(inset ? [spacer] : [])];

    const hasTotals = columns.some((c) => c.total);
    const totalsRow = tableColumns.map((c) =>
        c.total ? String(rows.reduce((sum, row) => sum + (Number(cellText(c, row)) || 0), 0)) : ''
    );

    const headerWidth = (column: Column<R>) => textWidth(column.header, fontSize, 'bold');
    const fittedWidth = (column: Column<R>) => {
        let widest = headerWidth(column);
        rows.forEach((row) => {
            widest = Math.max(widest, doc.getTextWidth(cellText(column, row)));
        });
        return widest + 8 + (column.indent ?? 0);
    };
    const columnStyles = Object.fromEntries([
        ...(leftSpacer ? [[0, { cellWidth: leftSpacer }]] : []),
        ...(inset ? [[tableColumns.length - 1, { cellWidth: inset }]] : []),
        ...tableColumns.flatMap((c, i) => (c.fit ? [[i, { cellWidth: fittedWidth(c) }]] : [])),
    ]);

    const tableBody = (tableRows: R[], headed: boolean) => {
        const body: RowInput[] = [];
        const spans: boolean[] = [];
        const blocks: number[] = [];
        let block = -1;
        let afterHeading = false;
        const push = (row: RowInput, span: boolean, heading = false) => {
            if (heading && !afterHeading) block += 1;
            afterHeading = heading;
            body.push(row);
            spans.push(span);
            blocks.push(Math.max(block, 0));
        };
        const spanRow = (content: string, styles: Partial<Styles>, heading: boolean) =>
            push([{ content, colSpan: tableColumns.length, styles }], true, heading);
        const addRows = (sectionRows: R[], level: number) => {
            const section = sections[level];
            if (!section) {
                sectionRows.forEach((row, i) => {
                    const previous = sectionRows[i - 1];
                    push(
                        tableColumns.map((c) =>
                            c.repeatKey && previous && c.repeatKey(row) === c.repeatKey(previous) ? '' : cellText(c, row)
                        ),
                        false
                    );
                });
                return;
            }
            splitBy(sectionRows, section.key).forEach((group) => {
                if (!(headed && level === 0)) spanRow(section.label(group[0]), headingStyle(level), true);
                addRows(group, level + 1);
                if (section.total) spanRow(section.total(group), totalStyle(), false);
            });
        };
        addRows(tableRows, 0);
        return { body, spans, blocks };
    };

    const BOTTOM_MARGIN = 40;

    const tableOptions = (
        body: RowInput[],
        spans: boolean[],
        foot: RowInput[] | undefined,
        top: number,
        styles: typeof columnStyles,
        label?: TableLabel
    ): UserOptions => ({
        theme: 'plain',
        head: [
            tableColumns.map((c) => c.header),
            ...(label ? [[{ content: label.content, colSpan: tableColumns.length, styles: label.styles }]] : []),
        ],
        body,
        foot,
        showFoot: 'lastPage',
        styles: { fontSize, cellPadding: 4, lineColor: [0, 0, 0] },
        columnStyles: styles,
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
            if (section === 'foot' || (section === 'head' && row.index !== 0)) return;
            if (section === 'body' && spans[row.index]) return;
            const pdfColumn = tableColumns[column.index];
            let offset = pdfColumn?.indent ?? 0;
            if (pdfColumn?.center && section === 'body') {
                offset += (headerWidth(pdfColumn) - doc.getTextWidth(cell.text.join(''))) / 2;
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
        startY: top,
        margin: { left: 20, right: 20, top, bottom: BOTTOM_MARGIN },
    });

    type DrawnTable = { finalY: number; columns: { width: number }[]; head: { height: number }[]; body: { height: number }[] };
    const lastTable = (pdf: jsPDF) => (pdf as unknown as { lastAutoTable: DrawnTable }).lastAutoTable;
    const lastTableY = () => lastTable(doc).finalY;

    const drawTable = (tableRows: R[], showTotals: boolean, top: number, label?: TableLabel) => {
        const { body, spans, blocks } = tableBody(tableRows, label?.fromSection ?? false);
        const foot = hasTotals && showTotals ? [totalsRow] : undefined;
        if (!keepTogether) {
            autoTable(doc, tableOptions(body, spans, foot, top, columnStyles, label));
            return;
        }
        const scratch = new jsPDF({ orientation: 'portrait', unit: 'pt' });
        autoTable(scratch, {
            ...tableOptions(body, spans, foot, top, columnStyles, label),
            rowPageBreak: 'avoid',
            willDrawCell: undefined,
            didDrawCell: undefined,
            didDrawPage: undefined,
        });
        const measured = lastTable(scratch);
        const room = pageHeight - BOTTOM_MARGIN - top - measured.head.reduce((sum, r) => sum + r.height, 0) - 1;
        const pageStarts = [0];
        let used = 0;
        splitBy(
            body.map((_, i) => i),
            (i) => String(blocks[i])
        ).forEach((block) => {
            const height = block.reduce((sum, i) => sum + measured.body[i].height, 0);
            if (used > 0 && used + height > room) {
                pageStarts.push(block[0]);
                used = 0;
            }
            used += height;
        });
        const fixedWidths = Object.fromEntries(
            measured.columns.map((c, i) => [i, { ...columnStyles[i], cellWidth: c.width }])
        );
        pageStarts.forEach((start, page) => {
            const end = pageStarts[page + 1] ?? body.length;
            const last = page === pageStarts.length - 1;
            if (page > 0) doc.addPage();
            autoTable(doc, {
                ...tableOptions(body.slice(start, end), spans.slice(start, end), last ? foot : undefined, top, fixedWidths, label),
                rowPageBreak: 'avoid',
            });
        });
    };
    let finalY: number;

    if (group) {
        const groups = splitBy(rows, group.key);
        groups.forEach((groupRows, index) => {
            const key = group.key(groupRows[0]);
            if (index > 0) doc.addPage();
            drawTable(groupRows, index === groups.length - 1, GROUP_TABLE_TOP, {
                content: group.label(key),
                styles: { fontSize: 10, lineWidth: 0 },
                fromSection: false,
            });
            let totalY = lastTableY() + 18;
            if (totalY > pageHeight - 50) {
                doc.addPage();
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
        const pageSection = sections[0]?.pageBreak ? sections[0] : undefined;
        const pages = pageSection ? splitBy(rows, pageSection.key) : [rows];
        const pageHeadingStyles = { ...headingStyle(0), lineWidth: 0 };
        pages.forEach((pageRows, index) => {
            if (index > 0) doc.addPage();
            const label = pageSection && { content: pageSection.label(pageRows[0]), styles: pageHeadingStyles, fromSection: true };
            drawTable(pageRows, index === pages.length - 1, 78, label);
        });
        finalY = lastTableY();
    }

    if (showCount) {
        const countLabelText = countText ? countText(rows) : `${countTitle}: ${rows.length}`;
        let countLabelY = finalY + 18;
        if (countLabelY > pageHeight - BOTTOM_MARGIN) {
            doc.addPage();
            countLabelY = 96;
        }
        doc.setFontSize(fontSize - 1);
        doc.setFont('helvetica', countBold || countUnderlineSplit ? 'bold' : 'normal');
        doc.text(countLabelText, pageCenter, countLabelY, { align: 'center' });

        const countLabelWidth = doc.getTextWidth(countLabelText);
        const countStartX = pageCenter - countLabelWidth / 2;
        const countEndX = pageCenter + countLabelWidth / 2;
        const countNumberX = countStartX + doc.getTextWidth(`${countTitle}: `);

        const countSegments = (() => {
            const match = countSplitNumber ? /\d+/.exec(countLabelText) : null;
            if (!match) return [[countStartX, countEndX]];
            const before = countLabelText.slice(0, match.index);
            const after = countLabelText.slice(match.index + match[0].length);
            const numberStartX = countStartX + doc.getTextWidth(before);
            const numberEndX = numberStartX + doc.getTextWidth(match[0]);
            return [
                [countStartX, countStartX + doc.getTextWidth(before.trimEnd())],
                [numberStartX, numberEndX],
                [countEndX - doc.getTextWidth(after.trimStart()), countEndX],
            ].filter(([startX, endX]) => endX > startX);
        })();

        if (countRule) {
            const ruleY = countLabelY - fontSize - 2;
            doc.setLineWidth(0.75);
            countSegments.forEach(([startX, endX]) => doc.line(startX, ruleY, endX, ruleY));
        }

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
                countSegments.forEach(([startX, endX]) => doubleUnderline(startX, endX));
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
    }

    const now = new Date();
    const generatedAt = [
        'FECHA:',
        now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
    ].join('         ');

    const footerY = pageHeight - 20;
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage(stcLogo, 'PNG', 20, LOGO_TOP, STC_LOGO_WIDTH, STC_LOGO_HEIGHT);
        doc.addImage(cdmxLogo, 'JPEG', pageWidth - 20 - LOGO_WIDTH, LOGO_TOP, LOGO_WIDTH, LOGO_HEIGHT);
        drawHeader();
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(footerTitle, 40, footerY);
        doc.text(generatedAt, pageCenter, footerY, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, footerY, { align: 'right' });
        doc.setFont('helvetica', 'normal');
    }

    return doc.output('blob');
}

export function openPdf<R>(report: PdfReport<R>) {
    const url = URL.createObjectURL(buildCatalogoPdfBlob(report));
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
