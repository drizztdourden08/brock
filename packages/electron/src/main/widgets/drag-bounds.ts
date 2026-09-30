/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetSnapLink, WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { dragWanted } from './drag-wanted';
import { snapTargets } from './snap-targets';
import { snapTo } from './snap-to';
import { tellMain } from './tell-main';
import { tellWindow } from './tell-window';
import { widgetWindowEntries } from './widget-window-entries';
import type { WidgetWindowEntry } from './widget-windows.type';

const sameLink = (a: WidgetSnapLink | null, b: WidgetSnapLink | null): boolean => a?.to === b?.to && a?.edge === b?.edge;

const relink = (id: string, entry: WidgetWindowEntry, link: WidgetSnapLink | null): void => {
  if (sameLink(link, entry.link)) return;
  entry.link = link;
  tellMain(id, { link });
  tellWindow(entry);
};

const dragBounds = (id: string): WidgetWindowBounds | null => {
  const entry = widgetWindowEntries.get(id);
  if (!entry || entry.towed || entry.win.isDestroyed()) return null;
  const cursor = screen.getCursorScreenPoint();
  const current = boundsOf(entry.win);
  entry.grab ??= { x: cursor.x - current.x, y: cursor.y - current.y };
  const wanted = dragWanted(cursor, entry.grab, current);
  if (!entry.snap) return wanted;
  const hit = snapTo(wanted, snapTargets(id));
  relink(id, entry, hit?.link ?? null);
  return hit?.bounds ?? wanted;
};

export { dragBounds };
