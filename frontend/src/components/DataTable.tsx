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
    centerHeader?: boolean;
    repeatKey?: (row: R) => string;
    above?: ReactNode;
}

interface DataTableProps<R> {
    title: string;
    columns: Column<R>[];
    rows: R[];
    className?: string;
    onRowSelect?: (row: R) => void;
    activeRow?: R | null;
    rowHeader?: boolean | number;
    header?: ReactNode;
}

interface DataTableRowProps<R> {
    row: R;
    rowIndex: number;
    columns: Column<R>[];
    highlighted: boolean;
    headerCols: number;
}

const HEADER_CELL = 'stc-table-header-cell';

const DataTableRow = memo(function DataTableRow<R>({ row, rowIndex, columns, highlighted, headerCols }: DataTableRowProps<R>) {
    return (
        <tr data-row={rowIndex} className={highlighted ? 'stc-table-row-active' : undefined}>
            {columns.map((col, colIndex) => (
                <td key={colIndex} data-col={colIndex} tabIndex={-1} className={colIndex < headerCols ? HEADER_CELL : undefined}>
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

export default function DataTable<R>({ title, columns, rows, className, onRowSelect, activeRow, rowHeader, header }: DataTableProps<R>) {
    const headerCols = rowHeader === true ? 1 : rowHeader || 0;
    const hasAbove = columns.some((col) => col.above != null);
    const firstCol = headerCols;
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

    const select = (pos: CellPos) => {
        selectedRef.current = pos;
        const body = bodyRef.current;
        if (!body) return;
        const tr = body.rows[pos.row]?.dataset.row != null ? body.rows[pos.row] : undefined;
        const cell = tr?.cells[pos.col];
        const wholeRow = pos.col < headerCols;
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

    useLayoutEffect(() => {
        if (activeRow === movedToRow.current) return;
        movedToRow.current = activeRow;
        const index = activeRow == null ? -1 : rows.indexOf(activeRow);
        if (index >= 0) selectedRef.current = { row: index, col: selectedRef.current.col };
    }, [activeRow, rows]);

    useLayoutEffect(() => select(selectedRef.current));

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
                nextCol = col < firstCol ? col : Math.max(firstCol, col - 1);
                break;
            case 'ArrowRight':
                nextCol = col < firstCol ? firstCol : Math.min(columns.length - 1, col + 1);
                break;
            default:
                return;
        }
        e.preventDefault();
        if (nextRow === row && nextCol === col) return;
        const cell = bodyRef.current?.rows[nextRow]?.cells[nextCol];
        if (!cell) return;
        cell.focus({ preventScroll: true });
        scrollToCell(cell);
    };

    return (
        <fieldset className="stc-table-frame">
            {}
            {title && <legend className="stc-table-frame-title">{title}</legend>}
            {header}
            <div className="stc-table-scroll" ref={scrollRef}>
                <table className={`stc-table${hasAbove ? ' stc-table-has-above' : ''}${className ? ` ${className}` : ''}`}>
                    <thead>
                        {hasAbove && (
                            <tr className="stc-table-above-row">
                                {columns.map((col, i) => (
                                    <th key={i}>{col.above}</th>
                                ))}
                            </tr>
                        )}
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
                                highlighted={highlightedRow === rowIndex}
                                headerCols={headerCols}
                            />
                        ))}
                        {rows.length === 0 && (
                            <tr className="stc-table-empty-row" aria-hidden="true">
                                {columns.map((_, colIndex) => (
                                    <td key={colIndex} className={colIndex < headerCols ? HEADER_CELL : undefined}>
                                        {' '}
                                    </td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
}
