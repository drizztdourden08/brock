/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { logBoot } from '../bootstrap/boot-timing';
import { bootEvents } from './boot-events';
import { bootState } from './boot-state';
import { fadeWindow } from './fade-window';
import { REVEAL_MS } from './reveal.constants';

const fadeTo = (win: BrowserWindow, opacity: number): Promise<void> =>
  new Promise((resolve) => { fadeWindow(win, opacity, REVEAL_MS, resolve); });

const crossfade = async (win: BrowserWindow): Promise<void> => {
  const { splash } = bootState;
  win.setOpacity(0);
  (bootState.present ?? (() => win.show()))();
  const fades = [fadeTo(win, 1)];
  if (splash && !splash.isDestroyed()) fades.push(fadeTo(splash, 0));
  await Promise.all(fades);
  if (splash && !splash.isDestroyed()) splash.destroy();
  bootState.splash = null;
  bootState.revealed = true;
  bootState.revealing = false;
  if (!bootState.headless && !win.isDestroyed()) win.focus();
  logBoot('revealed');
  bootEvents.emit('revealed');
};

export { crossfade };
