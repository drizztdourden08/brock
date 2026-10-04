/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { crossesScale } from './crosses-scale';
import { dragWanted } from './drag-wanted';
import { moveStep } from './move-step';
import { shouldIntervene } from './should-intervene';
import { snapTargets } from './snap-targets';
import { snapTo } from './snap-to';
import { widgetWindowEntries } from './widget-window-entries';
import type { WidgetWindowEntry } from './widget-windows.type';

const draggedEntry = (id: string): WidgetWindowEntry | null => {
  const entry = widgetWindowEntries.get(id);
  return entry && !entry.towed && !entry.win.isDestroyed() ? entry : null;
};

const dragBounds = (id: string, proposed: WidgetWindowBounds): WidgetWindowBounds | null => {
  const entry = draggedEntry(id);
  if (!entry) return null;
  const session = moveStep(id);
  const cursor = screen.getCursorScreenPoint();
  const current = boundsOf(entry.win);
  session.grab ??= { x: cursor.x - current.x, y: cursor.y - current.y };
  const wanted = dragWanted(cursor, session.grab, current);
  const crossing = crossesScale(current, wanted);
  const targets = snapTargets(id).filter((target) => !session.members.has(target.to));
  const hit = entry.snap && !crossing ? snapTo(wanted, targets) : null;
  session.hit = hit;
  const next = hit?.bounds ?? wanted;
  return shouldIntervene(proposed, next, hit !== null, crossing) ? next : null;
};

export { dragBounds };
