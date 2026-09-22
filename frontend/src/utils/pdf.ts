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
    countLabel = 'Registros'
): Blob {
    const orientation = columns.length > 6 ? 'landscape' : 'portrait';
    const doc = new jsPDF({ orientation, unit: 'pt' });

    const pageCenter = doc.internal.pageSize.getWidth() / 2;

    doc.setFontSize(9);
    doc.text('SUBDIRECCIÓN GENERAL DE ADMINISTRACIÓN Y FINANZAS', pageCenter, 30, { align: 'center' });
    doc.text('COORDINACIÓN DE TAQUILLAS', pageCenter, 44, { align: 'center' });
    doc.setFontSize(13);
    doc.text(title, pageCenter, 66, { align: 'center' });

    autoTable(doc, {
        startY: 78,
        head: [columns.map((c) => c.header)],
        body: rows.map((row) => columns.map((c) => cellText(c, row))),
        styles: { fontSize: 8, cellPadding: 4, lineColor: [0, 0, 0] },
        headStyles: {
            fillColor: false,
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: { top: 1, bottom: 1, left: 0, right: 0 },
            lineColor: [0, 0, 0],
        },
        margin: { left: 40, right: 40 },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    const countLabelText = `${countLabel}: ${rows.length}`;
    const countLabelY = finalY + 18;
    doc.setFontSize(9);
    doc.text(countLabelText, pageCenter, countLabelY, { align: 'center' });

    const countLabelWidth = doc.getTextWidth(countLabelText);
    const underlineStartX = pageCenter - countLabelWidth / 2;
    const underlineEndX = pageCenter + countLabelWidth / 2;
    doc.setLineWidth(0.75);
    doc.line(underlineStartX, countLabelY + 3, underlineEndX, countLabelY + 3);
    doc.line(underlineStartX, countLabelY + 6, underlineEndX, countLabelY + 6);

    const idColumn = columns[0];
    const pageHeight = doc.internal.pageSize.getHeight();
    let noteY = countLabelY + 20;
    let unofficialCount = 0;
    doc.setFontSize(8);
    if (idColumn) {
        rows.forEach((row, index) => {
            if (!/^0+$/.test(cellText(idColumn, row).trim())) return;
            unofficialCount += 1;
            if (noteY > pageHeight - 40) {
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

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.getWidth() - 90,
            doc.internal.pageSize.getHeight() - 20
        );
    }

    return doc.output('blob');
}
