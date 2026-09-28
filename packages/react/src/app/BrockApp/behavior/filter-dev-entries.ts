/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../../menu/menu.type';

const filterDevEntries = (entries: readonly MenuEntry[], developerTools: boolean): MenuEntry[] =>
  entries.flatMap<MenuEntry>((entry) => {
    if (entry === 'separator') return [entry];
    if (entry.devOnly && !developerTools) return [];
    return entry.children ? [{ ...entry, children: filterDevEntries(entry.children, developerTools) }] : [entry];
  });

export { filterDevEntries };
