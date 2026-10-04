/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { bootState } from '../boot/boot-state';
import { SPLASH_CAPTURE_DELAY_MS, SPLASH_CLOSED_MESSAGE } from './screenshot-flag.constants';

const delay = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const shown = (splash: BrowserWindow): Promise<void> =>
  (splash.isVisible() ? Promise.resolve() : new Promise((resolve) => { splash.once('show', () => resolve()); }));

const splashReady = async (): Promise<BrowserWindow> => {
  const splash = bootState.splash;
  if (!splash || splash.isDestroyed()) throw new Error(SPLASH_CLOSED_MESSAGE);
  await shown(splash);
  await delay(SPLASH_CAPTURE_DELAY_MS);
  if (splash.isDestroyed()) throw new Error(SPLASH_CLOSED_MESSAGE);
  return splash;
};

export { splashReady };
