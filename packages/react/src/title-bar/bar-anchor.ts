/* @layer renderer-shell @kind logic */
import { BAR_ACTION_PREFIX, BAR_ITEM_ATTRIBUTE, MENU_BUTTON_SELECTOR } from './title-bar.constants';

const shown = (element: HTMLElement | null): element is HTMLElement => element !== null && element.isConnected && element.closest('[inert]') === null;

const barAnchor = (id: string): HTMLElement | null => {
  const item = document.querySelector<HTMLElement>(`[${BAR_ITEM_ATTRIBUTE}="${BAR_ACTION_PREFIX}${id}"]`);
  if (shown(item)) return item;
  const menuButton = document.querySelector<HTMLElement>(MENU_BUTTON_SELECTOR);
  return shown(menuButton) ? menuButton : null;
};

export { barAnchor };
