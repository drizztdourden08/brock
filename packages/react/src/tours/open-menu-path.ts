/* @layer renderer-shell @kind logic */
import { menuItemLabel } from './menu-item-label';
import { menuItemsIn } from './menu-items-in';
import { openSubMenu } from './open-sub-menu';
import { rootMenuPanel } from './root-menu-panel';
import { waitMenuPanel } from './wait-menu-panel';

const openMenuPath = async (parents: readonly string[], signal: AbortSignal): Promise<void> => {
  let panel = await waitMenuPanel(() => rootMenuPanel(), signal);
  for (const label of parents) {
    const item = panel ? menuItemsIn(panel).find((entry) => menuItemLabel(entry) === label) : undefined;
    panel = item ? await openSubMenu(item, signal) : null;
    if (!panel) return;
  }
};

export { openMenuPath };
