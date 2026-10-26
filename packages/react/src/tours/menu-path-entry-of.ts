/* @layer renderer-shell @kind logic */
import { menuItemLabel } from './menu-item-label';
import { menuItemsIn } from './menu-items-in';
import { rootMenuPanel } from './root-menu-panel';
import { subMenuPanelOf } from './sub-menu-panel-of';

const menuPathEntryOf = (path: readonly string[], root: ParentNode = document): HTMLElement | null => {
  let panel: HTMLElement | null = rootMenuPanel(root);
  let item: HTMLElement | undefined;
  for (const label of path) {
    if (!panel) return null;
    item = menuItemsIn(panel).find((entry) => menuItemLabel(entry) === label);
    if (!item) return null;
    panel = subMenuPanelOf(item);
  }
  return item ?? null;
};

export { menuPathEntryOf };
