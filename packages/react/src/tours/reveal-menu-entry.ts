/* @layer renderer-shell @kind logic */
import { menuEntryOf } from './menu-entry-of';
import { openMenuPath } from './open-menu-path';
import { rootMenuPanel } from './root-menu-panel';
import { searchSubMenus } from './search-sub-menus';
import { waitMenuPanel } from './wait-menu-panel';

const revealMenuEntry = async (entry: string | readonly string[], signal: AbortSignal): Promise<void> => {
  if (typeof entry !== 'string') {
    await openMenuPath(entry.slice(0, -1), signal);
    return;
  }
  const root = await waitMenuPanel(() => rootMenuPanel(), signal);
  if (root && menuEntryOf(entry) === null) await searchSubMenus(entry, root, signal);
};

export { revealMenuEntry };
