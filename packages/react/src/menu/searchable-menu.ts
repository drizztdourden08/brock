/* @layer renderer-shell @kind logic */
import { dropEntries } from './drop-entries';
import { BAR_MARKER_KEYS } from './menu-config.constants';
import type { MenuEntry } from './menu.type';

const searchableMenu = (entries: readonly MenuEntry[]): MenuEntry[] => dropEntries(entries, (item) => item.hidden === true || BAR_MARKER_KEYS.has(item.key));

export { searchableMenu };
