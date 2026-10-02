import { memo, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';

export interface Column<R> {
    header: string;
    cell: (row: R) => ReactNode;
    total?: boolean;
    indent?: number;
    fit?: boolean;
    center?: boolean;
    repeatKey?: (row: R) => string;
}

interface DataTableProps<R> {
    title: string;
    columns: Column<R>[];
    rows: R[];
    className?: string;
    onRowSelect?: (row: R) => void;
    activeRow?: R | null;
}

interface DataTableRowProps<R> {
    row: R;
    rowIndex: number;
    columns: Column<R>[];
    selectedCol: number;
    highlighted: boolean;
}

const DataTableRow = memo(function DataTableRow<R>({ row, rowIndex, columns, selectedCol, highlighted }: DataTableRowProps<R>) {
    return (
        <tr data-row={rowIndex} className={highlighted ? 'stc-table-row-active' : undefined}>
            {columns.map((col, colIndex) => (
                <td
                    key={colIndex}
                    data-col={colIndex}
                    tabIndex={selectedCol === colIndex ? 0 : -1}
                    className={selectedCol === colIndex ? 'stc-table-cell-selected' : undefined}
                >
                    {col.cell(row)}
                </td>
            ))}
        </tr>
    );
}) as <R>(props: DataTableRowProps<R>) => ReactNode;

const cellPosition = (target: EventTarget) => {
    const cell = (target as HTMLElement).closest<HTMLTableCellElement>('td[data-col]');
    const tr = cell?.parentElement;
    if (!cell || !tr?.dataset.row) return null;
    return { row: Number(tr.dataset.row), col: Number(cell.dataset.col) };
};

export default function DataTable<R>({ title, columns, rows, className, onRowSelect, activeRow }: DataTableProps<R>) {
    const [selected, setSelected] = useState({ row: 0, col: 0 });
    const [syncedRow, setSyncedRow] = useState(activeRow);
    const bodyRef = useRef<HTMLTableSectionElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [loadedFromTable, setLoadedFromTable] = useState<R | null>(null);
    const [activeFromTable, setActiveFromTable] = useState(false);

    if (activeRow !== syncedRow) {
        setSyncedRow(activeRow);
        setActiveFromTable(activeRow != null && activeRow === loadedFromTable);
        setLoadedFromTable(null);
        const index = activeRow == null ? -1 : rows.indexOf(activeRow);
        if (index >= 0 && index !== selected.row) setSelected({ row: index, col: selected.col });
    }

    useEffect(() => {
        if (activeRow == null || activeFromTable) return;
        const container = scrollRef.current;
        const tr = bodyRef.current?.rows[rows.indexOf(activeRow)];
        if (!container || !tr) return;
        const header = container.querySelector('thead')?.getBoundingClientRect().height ?? 0;
        const box = container.getBoundingClientRect();
        container.scrollTop += tr.getBoundingClientRect().top - (box.top + header);
    }, [activeRow, activeFromTable, rows]);

    const highlightedRow = activeRow != null && !activeFromTable ? rows.indexOf(activeRow) : -1;

    const loadRow = (row: number) => {
        if (rows[row] === undefined) return;
        setLoadedFromTable(rows[row]);
        onRowSelect?.(rows[row]);
    };

    const handleFocus = (e: FocusEvent<HTMLTableSectionElement>) => {
        const pos = cellPosition(e.target);
        if (pos && (pos.row !== selected.row || pos.col !== selected.col)) setSelected(pos);
    };

    const handleDoubleClick = (e: MouseEvent<HTMLTableSectionElement>) => {
        const pos = cellPosition(e.target);
        if (pos) loadRow(pos.row);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTableSectionElement>) => {
        const pos = cellPosition(e.target);
        if (!pos) return;
        const { row, col } = pos;
        if (e.key === 'Enter') {
            e.preventDefault();
            loadRow(row);
            return;
        }
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
        bodyRef.current?.rows[nextRow]?.cells[nextCol]?.focus();
    };

    return (
        <fieldset className="stc-table-frame">
            <legend className="stc-table-frame-title">{title}</legend>
            <div className="stc-table-scroll" ref={scrollRef}>
                <table className={`stc-table${className ? ` ${className}` : ''}`}>
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody
                        ref={bodyRef}
                        onFocus={handleFocus}
                        onDoubleClick={handleDoubleClick}
                        onKeyDown={handleKeyDown}
                    >
                        {rows.map((row, rowIndex) => (
                            <DataTableRow
                                key={rowIndex}
                                row={row}
                                rowIndex={rowIndex}
                                columns={columns}
                                selectedCol={selected.row === rowIndex ? selected.col : -1}
                                highlighted={highlightedRow === rowIndex}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}
