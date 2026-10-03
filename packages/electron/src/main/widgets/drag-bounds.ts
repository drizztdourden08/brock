/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { crossesScale } from './crosses-scale';
import { dragWanted } from './drag-wanted';
import { relink } from './relink';
import { shouldIntervene } from './should-intervene';
import { snapTargets } from './snap-targets';
import { snapTo } from './snap-to';
import { widgetWindowEntries } from './widget-window-entries';
import type { Snapped, WidgetWindowEntry } from './widget-windows.type';

const draggedEntry = (id: string): WidgetWindowEntry | null => {
  const entry = widgetWindowEntries.get(id);
  return entry && !entry.towed && !entry.win.isDestroyed() ? entry : null;
};

const snapWhileDragging = (id: string, entry: WidgetWindowEntry, wanted: WidgetWindowBounds, crossing: boolean): Snapped | null => {
  if (!entry.snap) return null;
  const hit = crossing ? null : snapTo(wanted, snapTargets(id));
  relink(id, entry, hit?.link ?? null);
  return hit;
};

const dragBounds = (id: string, proposed: WidgetWindowBounds): WidgetWindowBounds | null => {
  const entry = draggedEntry(id);
  if (!entry) return null;
  const cursor = screen.getCursorScreenPoint();
  const current = boundsOf(entry.win);
  entry.grab ??= { x: cursor.x - current.x, y: cursor.y - current.y };
  const wanted = dragWanted(cursor, entry.grab, current);
  const crossing = crossesScale(current, wanted);
  const hit = snapWhileDragging(id, entry, wanted, crossing);
  const next = hit?.bounds ?? wanted;
  return shouldIntervene(proposed, next, hit !== null, crossing) ? next : null;
};

export { dragBounds };
