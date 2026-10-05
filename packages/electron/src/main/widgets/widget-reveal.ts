/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { bootEvents } from '../boot/boot-events';
import { bootState } from '../boot/boot-state';
import { fadeWindow } from '../boot/fade-window';
import { REVEAL_MS } from '../boot/reveal.constants';
import { REVEAL_WAIT_MS } from './widget-windows.constants';
import type { WidgetWindowEntry } from './widget-windows.type';

const held = new Set<WidgetWindowEntry>();
let presented = false;
let watching = false;

const waiting = (): boolean => {
  const { app } = bootState;
  return app !== null && !app.isDestroyed() && !presented && !bootState.revealed && !bootState.failure;
};

const show = (entry: WidgetWindowEntry, fade: boolean): void => {
  const { win } = entry;
  if (entry.parked || entry.hiddenWithApp || win.isDestroyed()) return;
  if (fade) win.setOpacity(0);
  win.showInactive();
  if (fade) fadeWindow(win, 1, REVEAL_MS);
};

const opened = (win: BrowserWindow): void => {
  if (!waiting()) return;
  bootState.holds.push(new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, REVEAL_WAIT_MS);
    const done = (): void => {
      clearTimeout(timer);
      resolve();
    };
    win.once('ready-to-show', done);
    win.once('closed', done);
  }));
};

const ready = (entry: WidgetWindowEntry): void => {
  if (waiting()) held.add(entry);
  else show(entry, bootState.revealing);
};

const present = (): void => {
  presented = true;
  for (const entry of held) show(entry, true);
  held.clear();
};

const restart = (): void => {
  presented = false;
  held.clear();
};

const watch = (): void => {
  if (watching) return;
  watching = true;
  bootEvents.on('window', restart);
  bootEvents.on('presenting', present);
};

const widgetReveal = { watch, opened, ready };

export { widgetReveal };
