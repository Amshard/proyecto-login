import {
    memo,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type FocusEvent,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
} from 'react';

export interface Column<R> {
    header: string;
    cell: (row: R) => ReactNode;
    total?: boolean;
    indent?: number;
    fit?: boolean;
    center?: boolean;
    left?: boolean;
    // Centers this column's title in the PDF.
    centerHeader?: boolean;
    repeatKey?: (row: R) => string;
}

interface DataTableProps<R> {
    title: string;
    columns: Column<R>[];
    rows: R[];
    className?: string;
    onRowSelect?: (row: R) => void;
    activeRow?: R | null;
    // The first column is a row header (in the header color): arrow keys skip it, and double-clicking it selects the whole row.
    rowHeader?: boolean;
}

interface DataTableRowProps<R> {
    row: R;
    rowIndex: number;
    columns: Column<R>[];
    highlighted: boolean;
}

// The selected cell (its class and tabIndex 0) is set straight on the DOM, not through React,
// so moving with the arrow keys touches two cells instead of re-rendering every row.
const DataTableRow = memo(function DataTableRow<R>({ row, rowIndex, columns, highlighted }: DataTableRowProps<R>) {
    return (
        <tr data-row={rowIndex} className={highlighted ? 'stc-table-row-active' : undefined}>
            {columns.map((col, colIndex) => (
                <td key={colIndex} data-col={colIndex} tabIndex={-1}>
                    {col.cell(row)}
                </td>
            ))}
        </tr>
    );
}) as <R>(props: DataTableRowProps<R>) => ReactNode;

const SELECTED = 'stc-table-cell-selected';
const ROW_SELECTED = 'stc-table-row-selected';

interface CellPos {
    row: number;
    col: number;
}

const cellPosition = (target: EventTarget): CellPos | null => {
    const cell = (target as HTMLElement).closest<HTMLTableCellElement>('td[data-col]');
    const tr = cell?.parentElement;
    if (!cell || !tr?.dataset.row) return null;
    return { row: Number(tr.dataset.row), col: Number(cell.dataset.col) };
};

export default function DataTable<R>({ title, columns, rows, className, onRowSelect, activeRow, rowHeader }: DataTableProps<R>) {
    // The first column arrow keys can reach.
    const firstCol = rowHeader ? 1 : 0;
    const selectedRef = useRef<CellPos>({ row: 0, col: firstCol });
    const [syncedRow, setSyncedRow] = useState(activeRow);
    const bodyRef = useRef<HTMLTableSectionElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [loadedFromTable, setLoadedFromTable] = useState<R | null>(null);
    const [activeFromTable, setActiveFromTable] = useState(false);
    const movedToRow = useRef(activeRow);

    if (activeRow !== syncedRow) {
        setSyncedRow(activeRow);
        setActiveFromTable(activeRow != null && activeRow === loadedFromTable);
        setLoadedFromTable(null);
    }

    // Moves the selected mark to `pos`; on a row header it marks the whole row instead of the cell.
    // The blank row of an empty table has no data-row and is skipped.
    const select = (pos: CellPos) => {
        selectedRef.current = pos;
        const body = bodyRef.current;
        if (!body) return;
        const tr = body.rows[pos.row]?.dataset.row != null ? body.rows[pos.row] : undefined;
        const cell = tr?.cells[pos.col];
        const wholeRow = rowHeader === true && pos.col === 0;
        const prev = body.querySelector<HTMLTableCellElement>('td[tabindex="0"]');
        if (prev && prev !== cell) {
            prev.classList.remove(SELECTED);
            prev.tabIndex = -1;
        }
        const prevRow = body.querySelector(`tr.${ROW_SELECTED}`);
        if (prevRow && (prevRow !== tr || !wholeRow)) prevRow.classList.remove(ROW_SELECTED);
        if (tr && cell) {
            cell.tabIndex = 0;
            cell.classList.toggle(SELECTED, !wholeRow);
            tr.classList.toggle(ROW_SELECTED, wholeRow);
        }
    };

    // A row loaded from outside the table (e.g. a search) takes the selection.
    useLayoutEffect(() => {
        if (activeRow === movedToRow.current) return;
        movedToRow.current = activeRow;
        const index = activeRow == null ? -1 : rows.indexOf(activeRow);
        if (index >= 0) selectedRef.current = { row: index, col: selectedRef.current.col };
    }, [activeRow, rows]);

    // After every render, put the mark back on the selected cell: rows may have been added or removed.
    useLayoutEffect(() => select(selectedRef.current));

    // Scrolls just enough to show the cell, keeping it clear of the sticky header.
    const scrollToCell = (cell: HTMLTableCellElement) => {
        const container = scrollRef.current;
        if (!container) return;
        const box = container.getBoundingClientRect();
        const header = container.querySelector('thead')?.getBoundingClientRect().height ?? 0;
        const rect = cell.getBoundingClientRect();
        const top = box.top + header;
        const bottom = box.top + container.clientHeight;
        if (rect.top < top) container.scrollTop -= top - rect.top;
        else if (rect.bottom > bottom) container.scrollTop += rect.bottom - bottom;
        const right = box.left + container.clientWidth;
        if (rect.left < box.left) container.scrollLeft -= box.left - rect.left;
        else if (rect.right > right) container.scrollLeft += rect.right - right;
    };

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
        if (pos) select(pos);
    };

    // A single click on a row header does nothing: without the browser's focus on mousedown it isn't selected.
    const handleMouseDown = (e: MouseEvent<HTMLTableSectionElement>) => {
        if (rowHeader && cellPosition(e.target)?.col === 0) e.preventDefault();
    };

    // Double-clicking a row header also selects its whole row.
    const handleDoubleClick = (e: MouseEvent<HTMLTableSectionElement>) => {
        const pos = cellPosition(e.target);
        if (!pos) return;
        if (rowHeader && pos.col === 0) bodyRef.current?.rows[pos.row]?.cells[0]?.focus({ preventScroll: true });
        loadRow(pos.row);
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
            // A row header stays out of reach; from a selected whole row, Left has nowhere to go and Right goes to its first cell.
            case 'ArrowLeft':
                nextCol = col < firstCol ? col : Math.max(firstCol, col - 1);
                break;
            case 'ArrowRight':
                nextCol = Math.min(columns.length - 1, col + 1);
                break;
            default:
                return;
        }
        e.preventDefault();
        if (nextRow === row && nextCol === col) return;
        const cell = bodyRef.current?.rows[nextRow]?.cells[nextCol];
        if (!cell) return;
        // The browser's own focus scroll can leave the row under the sticky header.
        cell.focus({ preventScroll: true });
        scrollToCell(cell);
    };

    return (
        <fieldset className="stc-table-frame">
            <legend className="stc-table-frame-title">{title}</legend>
            <div className="stc-table-scroll" ref={scrollRef}>
                <table className={`stc-table${rowHeader ? ' stc-table-row-header' : ''}${className ? ` ${className}` : ''}`}>
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
                        onMouseDown={handleMouseDown}
                        onDoubleClick={handleDoubleClick}
                        onKeyDown={handleKeyDown}
                    >
                        {rows.map((row, rowIndex) => (
                            <DataTableRow
                                key={rowIndex}
                                row={row}
                                rowIndex={rowIndex}
                                columns={columns}
                                highlighted={highlightedRow === rowIndex}
                            />
                        ))}
                        {rows.length === 0 && (
                            // A blank row so an empty table doesn't collapse to just its headers.
                            // It has no data-row, so it can't be selected or loaded.
                            <tr className="stc-table-empty-row" aria-hidden="true">
                                {columns.map((_, colIndex) => (
                                    <td key={colIndex}>{' '}</td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}
