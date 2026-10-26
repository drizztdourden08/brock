/* @layer renderer-shell @kind logic */
import { menuPathEntryOf } from './menu-path-entry-of';
import { MENU_ITEM_SELECTOR, MENU_LABEL_SELECTOR } from './tours.constants';

const labelledEntryOf = (label: string, root: ParentNode): HTMLElement | null => {
  const text = [...root.querySelectorAll(MENU_LABEL_SELECTOR)].find((element) => element.textContent.trim() === label);
  return text?.closest<HTMLElement>(MENU_ITEM_SELECTOR) ?? null;
};

const menuEntryOf = (entry: string | readonly string[], root: ParentNode = document): HTMLElement | null =>
  (typeof entry === 'string' ? labelledEntryOf(entry, root) : menuPathEntryOf(entry, root));

export { menuEntryOf };
