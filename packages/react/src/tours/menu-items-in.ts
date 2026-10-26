/* @layer renderer-shell @kind logic */
import { MENU_ITEM_SELECTOR, MENU_PANEL_SELECTOR } from './tours.constants';

const menuItemsIn = (panel: ParentNode): HTMLElement[] =>
  [...panel.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)].filter((item) => item.closest(MENU_PANEL_SELECTOR) === panel);

export { menuItemsIn };
