/* @layer renderer-shell @kind logic */
import { MENU_ITEM_SELECTOR, MENU_LABEL_SELECTOR } from './tours.constants';

const menuEntryOf = (label: string, root: ParentNode = document): HTMLElement | null => {
  const text = [...root.querySelectorAll(MENU_LABEL_SELECTOR)].find((element) => element.textContent.trim() === label);
  return text?.closest<HTMLElement>(MENU_ITEM_SELECTOR) ?? null;
};

export { menuEntryOf };
