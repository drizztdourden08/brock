/* @layer renderer-shell @kind logic */
import type { MenuEntry } from '../../../menu/menu.type';
import { isShown } from '../../../screens/show/is-shown';
import type { ShowContext } from '../../../screens/show/show.type';

const filterDevEntries = (entries: readonly MenuEntry[], developerTools: boolean, show?: ShowContext): MenuEntry[] =>
  entries.flatMap<MenuEntry>((entry) => {
    if (entry === 'separator') return [entry];
    if ((entry.devOnly && !developerTools) || !isShown(entry.show, show)) return [];
    return entry.children ? [{ ...entry, children: filterDevEntries(entry.children, developerTools, show) }] : [entry];
  });

export { filterDevEntries };
