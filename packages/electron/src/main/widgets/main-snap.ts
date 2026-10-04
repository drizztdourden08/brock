/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { crossesScale } from './crosses-scale';
import { dragWanted } from './drag-wanted';
import { isMainNormal } from './is-main-normal';
import { moveStep } from './move-step';
import { shouldIntervene } from './should-intervene';
import { snapMainAt } from './snap-main-at';
import { MAIN_ANCHOR } from './widget-windows.constants';

const dragTo = (main: BrowserWindow, proposed: WidgetWindowBounds): WidgetWindowBounds | null => {
  if (!isMainNormal(main)) return null;
  const session = moveStep(MAIN_ANCHOR);
  const cursor = screen.getCursorScreenPoint();
  const current = boundsOf(main);
  session.grab ??= { x: cursor.x - current.x, y: cursor.y - current.y };
  const wanted = dragWanted(cursor, session.grab, current);
  const crossing = crossesScale(current, wanted);
  const hit = crossing ? null : snapMainAt(wanted, session.members);
  session.hit = hit;
  const next = hit?.bounds ?? wanted;
  return shouldIntervene(proposed, next, hit !== null, crossing) ? next : null;
};

const mainSnap = { dragTo };

export { mainSnap };
