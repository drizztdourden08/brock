/* @layer renderer-shell @kind logic */
import { subMenuPanelOf } from './sub-menu-panel-of';
import { waitMenuPanel } from './wait-menu-panel';
import { MENU_POPUP_ATTRIBUTE } from './tours.constants';

const openSubMenu = async (item: HTMLElement, signal: AbortSignal): Promise<HTMLElement | null> => {
  if (item.getAttribute(MENU_POPUP_ATTRIBUTE) === null || signal.aborted) return null;
  const open = subMenuPanelOf(item);
  if (open) return open;
  item.click();
  return waitMenuPanel(() => subMenuPanelOf(item), signal);
};

export { openSubMenu };
