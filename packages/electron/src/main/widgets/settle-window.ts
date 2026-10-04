/* @layer electron-main @kind logic */
import { boundsOf } from './bounds-of';
import { dropStaleLink } from './drop-stale-link';
import { towHold } from './tow-hold';
import { towLinked } from './tow-linked';
import { widgetWindowEntries } from './widget-window-entries';

const settleWindow = (id: string): void => {
  const entry = widgetWindowEntries.get(id);
  if (!entry || entry.win.isDestroyed()) return;
  entry.grab = null;
  const now = boundsOf(entry.win);
  if (!entry.towed && !towHold.held()) {
    towLinked(id, entry.last, now);
    dropStaleLink(id, entry, now);
  }
  entry.last = now;
  entry.report.schedule();
};

export { settleWindow };
