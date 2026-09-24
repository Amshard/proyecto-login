import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Column } from '../components/DataTable';

function cellText<R>(column: Column<R>, row: R): string {
    const value = column.cell(row);
    return value === null || value === undefined ? '' : String(value);
}

export function buildCatalogoPdfBlob<R>(
    title: string,
    columns: Column<R>[],
    rows: R[],
    countLabel = 'Registros',
    countTitle = countLabel
): Blob {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt' });

    const pageCenter = doc.internal.pageSize.getWidth() / 2;

    doc.setFontSize(9);
    doc.text('SUBDIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS', pageCenter, 30, { align: 'center' });
    doc.text('COORDINACIÓN DE TAQUILLAS', pageCenter, 44, { align: 'center' });
    doc.setFontSize(13);
    doc.text(title, pageCenter, 66, { align: 'center' });

    const hasTotals = columns.some((c) => c.total);
    const totalsRow = columns.map((c) =>
        c.total ? String(rows.reduce((sum, row) => sum + (Number(cellText(c, row)) || 0), 0)) : ''
    );

    autoTable(doc, {
        startY: 78,
        theme: 'plain',
        head: [columns.map((c) => c.header)],
        body: rows.map((row) => columns.map((c) => cellText(c, row))),
        foot: hasTotals ? [totalsRow] : undefined,
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
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
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

    const idColumn = columns[0];
    const pageHeight = doc.internal.pageSize.getHeight();
    let noteY = countLabelY + 20;
    let unofficialCount = 0;
    doc.setFontSize(8);
    if (idColumn) {
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
        doc.setFontSize(8);
        doc.text(title, 40, footerY);
        doc.text(`FECHA: ${generatedAt}`, pageCenter, footerY, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 40, footerY, { align: 'right' });
    }

    return doc.output('blob');
}
