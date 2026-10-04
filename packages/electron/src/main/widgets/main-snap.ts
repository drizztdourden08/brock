/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { boundsOf } from './bounds-of';
import { crossesScale } from './crosses-scale';
import { dragWanted } from './drag-wanted';
import { isMainNormal } from './is-main-normal';
import { mainSnapState } from './main-snap-state';
import { manipulationRules } from './manipulation-rules';
import { modifierState } from './modifier-state';
import { oppositeEdge } from './opposite-edge';
import { relink } from './relink';
import { shouldIntervene } from './should-intervene';
import { snapMainAt } from './snap-main-at';
import { widgetWindowEntries } from './widget-window-entries';
import { MAIN_ANCHOR } from './widget-windows.constants';

const dragTo = (main: BrowserWindow, proposed: WidgetWindowBounds): WidgetWindowBounds | null => {
  if (!isMainNormal(main)) return null;
  const cursor = screen.getCursorScreenPoint();
  const current = boundsOf(main);
  mainSnapState.grab ??= { x: cursor.x - current.x, y: cursor.y - current.y };
  const wanted = dragWanted(cursor, mainSnapState.grab, current);
  const crossing = crossesScale(current, wanted);
  const hit = crossing || !manipulationRules(modifierState.ctrl, true).snap ? null : snapMainAt(wanted);
  const next = hit?.bounds ?? wanted;
  mainSnapState.hit = hit;
  return shouldIntervene(proposed, next, hit !== null, crossing) ? next : null;
};

const settle = (): void => {
  const { hit } = mainSnapState;
  mainSnapState.grab = null;
  mainSnapState.hit = null;
  const link = hit?.link ?? null;
  const entry = link ? widgetWindowEntries.get(link.to) : undefined;
  if (!link || !entry || entry.win.isDestroyed() || !entry.snap || entry.link) return;
  relink(link.to, entry, { to: MAIN_ANCHOR, edge: oppositeEdge(link.edge) });
};

const mainSnap = { dragTo, settle };

export { mainSnap };
