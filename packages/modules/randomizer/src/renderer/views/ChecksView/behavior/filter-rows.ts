/* @layer renderer-shell @kind logic */
import type { CheckRow, RowFilter } from './check-row.type';

const filterRows = (rows: readonly CheckRow[], { filter, search }: RowFilter): CheckRow[] => {
  const needle = search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filter !== 'all' && row.status !== filter) return false;
    return needle === '' || `${row.label} ${row.item ?? ''}`.toLowerCase().includes(needle);
  });
};

export { filterRows };
