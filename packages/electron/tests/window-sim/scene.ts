/* @layer electron-main @kind test */
import { BrowserWindow } from 'electron';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import { attachWidgetWindow } from '../../src/main/widgets/attach-widget-window';
import { followMainWindow } from '../../src/main/widgets/follow-main-window';
import { modifierState } from '../../src/main/widgets/modifier-state';
import { widgetWindowControl } from '../../src/main/widgets/widget-window-control';
import { widgetWindowEntries } from '../../src/main/widgets/widget-window-entries';
import { aspectLock } from '../../src/main/window/aspect-lock';
import { NO_ASPECT_LOCK } from '../../src/main/window/aspect-lock.constants';
import { setMainWindow } from '../../src/main/window/set-main-window';
import { resetSim, simOf } from './fake-electron';
import type { FakeWindow } from './fake-electron';
import type { Rect } from './window-sim.type';

const MAIN_MIN = { width: 640, height: 400 };
const WIDGET_MIN = { width: 240, height: 160 };

const openMain = (bounds: Rect): FakeWindow => {
  const win = new BrowserWindow({ ...bounds, minWidth: MAIN_MIN.width, minHeight: MAIN_MIN.height, title: 'main' });
  setMainWindow(win);
  followMainWindow(win);
  return simOf(win);
};

const openWidget = (id: string, bounds: Rect, popped: WidgetWindowOpen = {}): FakeWindow => {
  const win = new BrowserWindow({ ...bounds, minWidth: WIDGET_MIN.width, minHeight: WIDGET_MIN.height, title: id });
  const entry = widgetWindowControl.register(id, win, { snap: true, sync: true, ...popped });
  attachWidgetWindow(id, win, entry);
  return simOf(win);
};

const linkOf = (id: string) => widgetWindowEntries.get(id)?.link ?? null;

const closeScene = (windows: readonly FakeWindow[]): void => {
  for (const win of [...windows].reverse()) if (!win.isDestroyed()) win.destroy();
  widgetWindowEntries.clear();
  setMainWindow(null);
  modifierState.ctrl = false;
  aspectLock.set(NO_ASPECT_LOCK);
  resetSim();
};

export { closeScene, linkOf, openMain, openWidget };
