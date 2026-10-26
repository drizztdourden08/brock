/* @layer renderer-shell @kind logic */
import { MENU_LABEL_PART } from './tours.constants';

const menuItemLabel = (item: HTMLElement): string => item.querySelector(MENU_LABEL_PART)?.textContent.trim() ?? '';

export { menuItemLabel };
