/* @layer renderer-shell @kind logic */
import { dropEntries } from './drop-entries';
import { VIEW_MENU_KEY } from './menu-config.constants';
import type { MenuEntry } from './menu.type';

const searchableMenu = (entries: readonly MenuEntry[]): MenuEntry[] => dropEntries(entries, (item) => item.hidden === true || item.key === VIEW_MENU_KEY);

export { searchableMenu };
