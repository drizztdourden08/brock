/* @layer renderer-shell @kind logic */
import type { CheckRow, RowFilter } from './check-row.type';

const facetsMatch = (row: CheckRow, { facets, facetMode }: RowFilter): boolean => {
  if (facets.length === 0) return true;
  return facetMode === 'all' ? facets.every((id) => row.facets.includes(id)) : facets.some((id) => row.facets.includes(id));
};

const filterRows = (rows: readonly CheckRow[], filter: RowFilter): CheckRow[] => {
  const needle = filter.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filter.status !== 'all' && row.status !== filter.status) return false;
    if (filter.kind !== 'all' && row.kind !== filter.kind) return false;
    if (!facetsMatch(row, filter)) return false;
    return needle === '' || `${row.label} ${row.itemLabel ?? ''}`.toLowerCase().includes(needle);
  });
};

export { filterRows };
