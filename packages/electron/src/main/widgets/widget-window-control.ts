/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import type { WidgetPinMode, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowState } from '@drizztdourden08/brock-core';
import { applyPin } from './apply-pin';
import { boundsOf } from './bounds-of';
import { liveEntries } from './live-entries';
import { mainOnTop } from './main-on-top';
import { tellMain } from './tell-main';
import { tellWindow } from './tell-window';
import { widgetWindowEntries } from './widget-window-entries';
import { windowStateOf } from './window-state-of';
import type { WidgetWindowEntry } from './widget-windows.type';

const liveEntry = (id: string): WidgetWindowEntry | null => {
  const entry = widgetWindowEntries.get(id);
  return entry && !entry.win.isDestroyed() ? entry : null;
};

const register = (id: string, win: BrowserWindow, popped?: WidgetWindowOpen): WidgetWindowEntry => {
  const entry: WidgetWindowEntry = {
    win, pin: popped?.pin ?? 'off', snap: popped?.snap ?? true, link: null, last: boundsOf(win), towed: false, grab: null, hiddenWithApp: false,
  };
  widgetWindowEntries.set(id, entry);
  applyPin(entry, mainOnTop());
  return entry;
};

const unregister = (id: string): void => {
  widgetWindowEntries.delete(id);
  for (const entry of widgetWindowEntries.values()) if (entry.link?.to === id) entry.link = null;
};

const setPin = (id: string, mode: WidgetPinMode): WidgetPinMode => {
  const entry = liveEntry(id);
  if (!entry) return 'off';
  entry.pin = mode;
  applyPin(entry, mainOnTop());
  tellMain(id, { pin: mode });
  return mode;
};

const setSnap = (id: string, on: boolean): void => {
  const entry = liveEntry(id);
  if (!entry) return;
  entry.snap = on;
  if (!on) entry.link = null;
  tellMain(id, on ? { snap: on } : { snap: on, link: null });
  tellWindow(entry);
};

const mirrorMainPin = (onTop: boolean): void => {
  for (const [, entry] of liveEntries()) if (entry.pin === 'with-app') applyPin(entry, onTop);
};

const stateOf = (id: string): WidgetWindowState | null => {
  const entry = liveEntry(id);
  return entry ? windowStateOf(entry) : null;
};

const list = (): WidgetWindowInfo[] =>
  liveEntries().map(([id, entry]) => ({ id, focused: entry.win.isFocused(), visible: entry.win.isVisible() }));

const widgetWindowControl = { register, unregister, setPin, setSnap, mirrorMainPin, stateOf, list, windowOf: (id: string) => liveEntry(id)?.win ?? null };

export { widgetWindowControl };
