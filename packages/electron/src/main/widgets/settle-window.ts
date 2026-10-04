/* @layer electron-main @kind logic */
import { boundsOf } from './bounds-of';
import { dropStaleLink } from './drop-stale-link';
import { resizeSession } from './resize-session';
import { towHold } from './tow-hold';
import { towCluster } from './tow-cluster';
import { widgetWindowEntries } from './widget-window-entries';

const settleWindow = (id: string): void => {
  const entry = widgetWindowEntries.get(id);
  if (!entry || entry.win.isDestroyed()) return;
  const now = boundsOf(entry.win);
  if (!entry.towed && !towHold.held() && !resizeSession.active()) {
    towCluster(id, entry.last, now);
    dropStaleLink(id, entry, now);
  }
  entry.last = now;
  entry.report.schedule();
};

export { settleWindow };
