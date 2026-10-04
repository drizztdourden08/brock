/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../../menu/menu.type';
import { tidySeparators } from '../../../menu/tidy-separators';

const keep = (entries: readonly MenuEntry[], ids: ReadonlySet<string>): MenuEntry[] => entries.flatMap((entry): MenuEntry[] => {
  if (entry === 'separator') return [entry];
  if (ids.has(entry.key)) return [];
  if (!entry.children) return [entry];
  const children = keep(entry.children, ids);
  return children.some((child) => child !== 'separator') ? [{ ...entry, children: tidySeparators(children) }] : [];
});

const withoutActionEntries = (entries: readonly MenuEntry[], actionIds: readonly string[]): MenuEntry[] =>
  actionIds.length === 0 ? [...entries] : tidySeparators(keep(entries, new Set(actionIds)));

export { withoutActionEntries };
