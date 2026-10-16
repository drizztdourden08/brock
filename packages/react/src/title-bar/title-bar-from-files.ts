/* @layer renderer-shell @kind logic */
import type { TitleBarItemEntry } from './title-bar-item.type';

const byOrderThenId = (a: TitleBarItemEntry, b: TitleBarItemEntry): number => {
  if (a.order !== undefined && b.order !== undefined && a.order !== b.order) return a.order - b.order;
  if ((a.order === undefined) !== (b.order === undefined)) return a.order === undefined ? 1 : -1;
  return a.id.localeCompare(b.id);
};

const titleBarFromFiles = (entries: readonly TitleBarItemEntry[]): readonly TitleBarItemEntry[] =>
  [...entries].sort(byOrderThenId);

export { titleBarFromFiles };
