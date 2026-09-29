/* @layer renderer-shell @kind logic */
import type { MenuEntry, MenuItem } from '../../menu/menu.type';

const isMenuItem = (entry: MenuEntry): entry is MenuItem => entry !== 'separator';

export { isMenuItem };
