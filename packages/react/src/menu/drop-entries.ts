/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from './menu.type';
import { tidySeparators } from './tidy-separators';

const dropEntries = (entries: readonly MenuEntry[], drop: (item: MenuItem) => boolean): MenuEntry[] =>
  tidySeparators(entries.flatMap((entry): MenuEntry[] => {
    if (entry === 'separator') return [entry];
    if (drop(entry)) return [];
    if (!entry.children) return [entry];
    const children = dropEntries(entry.children, drop);
    return children.length === 0 && entry.children.length > 0 ? [] : [{ ...entry, children }];
  }));

export { dropEntries };
