/* @layer electron-main @kind logic */
import { BrowserWindow } from 'electron';
import type {
  WidgetProbeFacts, WidgetProbeRequest, WidgetWindowBounds, WidgetWindowPoint, WindowClusterAction, WindowGuideMode,
} from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { offscreenOrigin } from '../window/offscreen-origin';
import { anyWindow } from './any-window';
import { clusterLayout } from './cluster-layout';
import { clusterVisibility } from './cluster-visibility';
import { guideDrawn } from './guide-drawn';
import { modifierState } from './modifier-state';
import { probeFacts } from './probe-facts';
import { tourSpotLit } from './tour-spot-lit';
import { clickInWindow } from './click-in-window';
import { driveResize } from './drive-resize';
import { windowGuide } from './window-guide';
import { FOCUS_AWAY_MS, MAIN_ANCHOR, PROBE_MOUSE_EVENTS, PROBE_SETTLE_MS } from './widget-windows.constants';

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
  if (win) driveResize(win, bounds);
  await settled();
  return probeFacts(id);
};

const runCluster = (id: string, action: WindowClusterAction, area?: WidgetWindowBounds): void => {
  if (action === 'maximize' || action === 'fullscreen') clusterLayout.enter(id, action === 'maximize' ? 'maximized' : 'fullscreen', area);
  else if (action === 'minimize') clusterVisibility.minimize(id);
  else if (!clusterLayout.restore(id)) clusterVisibility.restore(id);
};

const guide = async (id: string, mode: WindowGuideMode | null, pointer?: WidgetWindowPoint): Promise<WidgetProbeFacts> => {
  if (mode) windowGuide.touch(id, mode, pointer);
  else windowGuide.end(id);
  await settled();
  return probeFacts(id, await guideDrawn());
};

const pressCtrl = async (ctrl: boolean): Promise<WidgetProbeFacts> => {
  const main = getMainWindow();
  if (main && !main.isDestroyed()) main.webContents.sendInputEvent({ type: ctrl ? 'keyDown' : 'keyUp', keyCode: 'Control', modifiers: ctrl ? ['control'] : [] });
  for (let tries = 0; tries < 10 && modifierState.ctrl !== ctrl; tries += 1) await settled();
  return probeFacts(MAIN_ANCHOR);
};

const sendMouse = async (id: string, action: keyof typeof PROBE_MOUSE_EVENTS, point: WidgetWindowPoint): Promise<WidgetProbeFacts> => {
  const win = anyWindow(id);
  const at = { x: Math.round(point.x), y: Math.round(point.y) };
  if (win) win.webContents.sendInputEvent({ type: PROBE_MOUSE_EVENTS[action], ...at, button: 'left', clickCount: 1, modifiers: action === 'up' ? [] : ['leftbuttondown'] });
  await settled();
  return probeFacts(id);
};

const clickIn = async (id: string, selector: string): Promise<WidgetProbeFacts> => {
  const clicked = await clickInWindow(anyWindow(id), selector);
  await settled();
  return { ...probeFacts(id), clicked };
};

const windowProbe = async (request: WidgetProbeRequest): Promise<WidgetProbeFacts | null> => {
  if (request.kind === 'mouse') return sendMouse(request.id, request.action, request.point);
  if (request.kind === 'focusAway') return focusAway(request.id);
  if (request.kind === 'resize') return resize(request.id, request.bounds);
  if (request.kind === 'modifier') return pressCtrl(request.ctrl);
  if (request.kind === 'cluster') {
    runCluster(request.id, request.action, request.area);
    await settled();
    return probeFacts(request.id);
  }
  if (request.kind === 'guide') return guide(request.id, request.mode, request.pointer);
  if (request.kind === 'tourSpot') return { ...probeFacts(request.id), tourLit: await tourSpotLit(anyWindow(request.id)) };
  if (request.kind === 'click') return clickIn(request.id, request.selector);
  return null;
};

export { windowProbe };
