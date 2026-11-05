/* @layer renderer-shell @kind logic */
import type { CheckRow } from '../../ChecksView/behavior/check-row.type';
import { MAX_BURST, MAX_VISIBLE } from '../CheckToasts.constants';
import type { CheckToastEntry } from '../CheckToasts.type';

const admitToasts = (
  entries: readonly CheckToastEntry[],
  rows: readonly CheckRow[],
  nextId: () => string,
): readonly CheckToastEntry[] => {
  if (rows.length === 0 || rows.length > MAX_BURST) return entries;
  return [...entries, ...rows.map((row) => ({ id: nextId(), row }))].slice(-MAX_VISIBLE);
};

export { admitToasts };
