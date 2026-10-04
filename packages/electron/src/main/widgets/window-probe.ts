/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type { WidgetProbeFacts, WidgetProbeRequest, WidgetWindowBounds, WindowGroupAction } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { offscreenOrigin } from '../window/offscreen-origin';
import { anyWindow } from './any-window';
import { groupLayout } from './group-layout';
import { groupOf } from './group-of';
import { groupVisibility } from './group-visibility';
import { modifierState } from './modifier-state';
import { probeFacts } from './probe-facts';
import { resizeBounds } from './resize-bounds';
import { settleWindow } from './settle-window';
import { windowGuide } from './window-guide';
import { FOCUS_AWAY_MS, MAIN_ANCHOR, PROBE_SETTLE_MS } from './widget-windows.constants';

const settled = (ms = PROBE_SETTLE_MS): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const focusAway = async (id: string): Promise<WidgetProbeFacts> => {
  const other = new BrowserWindow({ ...offscreenOrigin(), width: 240, height: 160, show: false, frame: false, skipTaskbar: true, title: 'focus-away' });
  other.show();
  other.focus();
  await settled(FOCUS_AWAY_MS);
  const facts = probeFacts(id);
  other.destroy();
  await settled();
  return facts;
};

const resize = async (id: string, bounds: WidgetWindowBounds): Promise<WidgetProbeFacts> => {
  const win = anyWindow(id);
  if (win) {
    win.setBounds(resizeBounds(id, bounds) ?? bounds);
    if (id !== MAIN_ANCHOR) settleWindow(id);
  }
  await settled();
  return probeFacts(id);
};

const runGroup = (id: string, action: WindowGroupAction, area?: WidgetWindowBounds): void => {
  const group = groupOf(id);
  if (group === null) return;
  if (action === 'maximize' || action === 'fullscreen') groupLayout.enter(group, action === 'maximize' ? 'maximized' : 'fullscreen', area);
  else if (action === 'minimize') groupVisibility.minimize(group);
  else if (!groupLayout.restore(group)) groupVisibility.restore(group);
};

const pressCtrl = async (ctrl: boolean): Promise<WidgetProbeFacts> => {
  const main = getMainWindow();
  if (main && !main.isDestroyed()) main.webContents.sendInputEvent({ type: ctrl ? 'keyDown' : 'keyUp', keyCode: 'Control', modifiers: ctrl ? ['control'] : [] });
  for (let tries = 0; tries < 10 && modifierState.ctrl !== ctrl; tries += 1) await settled();
  return probeFacts(MAIN_ANCHOR);
};

const windowProbe = async (request: WidgetProbeRequest): Promise<WidgetProbeFacts | null> => {
  if (request.kind === 'focusAway') return focusAway(request.id);
  if (request.kind === 'resize') return resize(request.id, request.bounds);
  if (request.kind === 'modifier') return pressCtrl(request.ctrl);
  if (request.kind === 'group') {
    runGroup(request.id, request.action, request.area);
    await settled();
    return probeFacts(request.id);
  }
  if (request.kind === 'guide') {
    if (request.mode) windowGuide.touch(request.mode);
    else windowGuide.end();
    await settled();
    return probeFacts(request.id);
  }
  return null;
};

export { windowProbe };
