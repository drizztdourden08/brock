/* @layer renderer-shell @kind logic */
import { MENU_PANEL_SELECTOR, SUB_MENU_PART } from './tours.constants';

const rootMenuPanel = (root: ParentNode = document): HTMLElement | null =>
  [...root.querySelectorAll<HTMLElement>(MENU_PANEL_SELECTOR)].find((panel) => panel.closest(SUB_MENU_PART) === null) ?? null;

export { rootMenuPanel };
