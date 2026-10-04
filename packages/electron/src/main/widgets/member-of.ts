/* @layer electron-main @kind logic */
import { getMainWindow } from '../window/get-main-window';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';
import type { ClusterMember } from './widget-windows.type';

const memberOf = (id: string): ClusterMember | null => {
  if (id === MAIN_ANCHOR) {
    const main = getMainWindow();
    return main && !main.isDestroyed() ? { id, win: main, entry: null } : null;
  }
  const entry = widgetWindowEntries.get(id);
  return entry && !entry.win.isDestroyed() ? { id, win: entry.win, entry } : null;
};

export { memberOf };
