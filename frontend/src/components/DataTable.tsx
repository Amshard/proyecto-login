import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

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

function selectCellText(cell: HTMLTableCellElement | null) {
    if (!cell) return;
    const range = document.createRange();
    range.selectNodeContents(cell);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
}

export default function DataTable<R>({ title, columns, rows, className }: DataTableProps<R>) {
    const [selected, setSelected] = useState({ row: 0, col: 0 });
    const cellRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

    const focusCell = (row: number, col: number) => {
        const cell = cellRefs.current[row]?.[col];
        if (!cell) return;
        cell.focus();
        setSelected({ row, col });
        selectCellText(cell);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>, row: number, col: number) => {
        let nextRow = row;
        let nextCol = col;
        switch (e.key) {
            case 'ArrowUp':
                nextRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                nextRow = Math.min(rows.length - 1, row + 1);
                break;
            case 'ArrowLeft':
                nextCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                nextCol = Math.min(columns.length - 1, col + 1);
                break;
            default:
                return;
        }
        e.preventDefault();
        focusCell(nextRow, nextCol);
    };

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
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        ref={(el) => {
                                            (cellRefs.current[rowIndex] ??= [])[colIndex] = el;
                                        }}
                                        tabIndex={selected.row === rowIndex && selected.col === colIndex ? 0 : -1}
                                        className={
                                            selected.row === rowIndex && selected.col === colIndex
                                                ? 'stc-table-cell-selected'
                                                : undefined
                                        }
                                        onFocus={(e) => {
                                            setSelected({ row: rowIndex, col: colIndex });
                                            selectCellText(e.currentTarget);
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                    >
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}
