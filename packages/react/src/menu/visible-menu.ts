/* @layer renderer-shell @kind logic */
import { dropEntries } from './drop-entries';
import type { MenuEntry } from './menu.type';

const visibleMenu = (entries: readonly MenuEntry[]): MenuEntry[] => dropEntries(entries, (item) => item.hidden === true || item.inMenu === false);

export { visibleMenu };
