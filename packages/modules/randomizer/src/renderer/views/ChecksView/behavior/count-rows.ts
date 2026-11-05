/* @layer renderer-shell @kind logic */
import type { TrackerCounts } from '../../../../tracker';
import type { CheckRow } from './check-row.type';

const countRows = (rows: readonly CheckRow[]): TrackerCounts => {
  const counts: TrackerCounts = { checked: 0, available: 0, blocked: 0, total: rows.length };
  for (const row of rows) counts[row.status] += 1;
  return counts;
};

export { countRows };
