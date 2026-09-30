/* @layer electron-main @kind logic */
import { boundsOf } from './bounds-of';
import { towLinked } from './tow-linked';
import { widgetWindowEntries } from './widget-window-entries';

const settleWindow = (id: string): void => {
  const entry = widgetWindowEntries.get(id);
  if (!entry || entry.win.isDestroyed()) return;
  entry.grab = null;
  const now = boundsOf(entry.win);
  if (!entry.towed) towLinked(id, now.x - entry.last.x, now.y - entry.last.y);
  entry.last = now;
};

export { settleWindow };
