import type { ReactNode } from 'react';

export interface Column<R> {
    header: string;
    cell: (row: R) => ReactNode;
}

interface DataTableProps<R> {
    title: string;
    columns: Column<R>[];
    rows: R[];
    className?: string;
}

export default function DataTable<R>({ title, columns, rows, className }: DataTableProps<R>) {
    return (
        <fieldset className="stc-table-frame">
            <legend className="stc-table-frame-title">{title}</legend>
            <div className="stc-table-scroll">
                <table className={`stc-table${className ? ` ${className}` : ''}`}>
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col, i) => (
                                    <td key={i}>{col.cell(row)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}
