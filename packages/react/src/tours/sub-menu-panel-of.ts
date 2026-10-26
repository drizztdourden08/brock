/* @layer renderer-shell @kind logic */
import { MENU_CONTROLS_ATTRIBUTE, MENU_PANEL_SELECTOR } from './tours.constants';

const subMenuPanelOf = (item: HTMLElement): HTMLElement | null => {
  const id = item.getAttribute(MENU_CONTROLS_ATTRIBUTE);
  const part = id === null ? null : item.ownerDocument.getElementById(id);
  if (!part) return null;
  return part.matches(MENU_PANEL_SELECTOR) ? part : part.querySelector<HTMLElement>(MENU_PANEL_SELECTOR);
};

export { subMenuPanelOf };
