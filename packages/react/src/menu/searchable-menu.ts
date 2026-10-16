/* @layer renderer-shell @kind logic */
import { dropEntries } from './drop-entries';
import type { MenuEntry } from './menu.type';

const searchableMenu = (entries: readonly MenuEntry[]): MenuEntry[] => dropEntries(entries, (item) => item.hidden === true);

export { searchableMenu };
