/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { aspectLock } from '../window/aspect-lock';
import { applyResize } from './apply-resize';
import { beginResize } from './begin-resize';
import { endResize } from './end-resize';
import { manipulationRules } from './manipulation-rules';
import { modifierState } from './modifier-state';
import { planResize } from './plan-resize';
import { refineSides } from './refine-sides';
import { resizeSession } from './resize-session';
import { widgetWindowEntries } from './widget-window-entries';
import type { ResizeSession, WillResizeCue } from './widget-windows.type';

const sessionFor = (id: string, win: BrowserWindow, proposed: WidgetWindowBounds, edge?: string): ResizeSession => {
  const own = resizeSession.of(id);
  if (own) return own;
  const other = resizeSession.current();
  if (other) endResize(other.id);
  return resizeSession.open(beginResize(id, win, proposed, edge));
};

const onWillResize = (id: string, win: BrowserWindow, { event, proposed, edge }: WillResizeCue): void => {
  const session = sessionFor(id, win, proposed, edge);
  refineSides(session, proposed);
  const rules = manipulationRules(modifierState.ctrl, widgetWindowEntries.get(id)?.snap ?? true);
  event.preventDefault();
  applyResize(session, planResize(session, { proposed, rules, lock: aspectLock.get() }));
};

export { onWillResize };
