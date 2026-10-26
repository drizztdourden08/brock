/* @layer renderer-shell @kind logic */
import { closeSubMenu } from './close-sub-menu';
import { menuEntryOf } from './menu-entry-of';
import { menuItemsIn } from './menu-items-in';
import { openSubMenu } from './open-sub-menu';
import { MENU_POPUP_ATTRIBUTE } from './tours.constants';

const searchSubMenus = async (label: string, panel: HTMLElement, signal: AbortSignal): Promise<boolean> => {
  for (const item of menuItemsIn(panel).filter((entry) => entry.getAttribute(MENU_POPUP_ATTRIBUTE) !== null)) {
    const sub = await openSubMenu(item, signal);
    if (!sub) continue;
    if (menuEntryOf(label, sub) !== null || await searchSubMenus(label, sub, signal)) return true;
    if (signal.aborted) return false;
    closeSubMenu(sub);
  }
  return false;
};

export { searchSubMenus };
