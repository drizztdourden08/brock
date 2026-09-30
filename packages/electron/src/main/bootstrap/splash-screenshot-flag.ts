/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { BrowserWindow } from 'electron';
import { REVIEW_FLAG } from '@drizztdourden08/brock-core/review';
import type { MainContext } from '../types/main-context.type';
import { captureWindow } from '../handlers/capture-window';
import { bootEvents } from '../boot/boot-events';
import { bootState } from '../boot/boot-state';
import { whenRevealed } from '../boot/when-revealed';
import { SPLASH_CAPTURE_DELAY_MS, SPLASH_SCREENSHOT_FLAG } from './screenshot-flag.constants';

const delay = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const shown = (splash: BrowserWindow): Promise<void> =>
  (splash.isVisible() ? Promise.resolve() : new Promise((resolve) => { splash.once('show', () => resolve()); }));

const captureSplash = async (ctx: MainContext, name: string): Promise<void> => {
  const splash = bootState.splash;
  try {
    if (!splash || splash.isDestroyed()) throw new Error('the splash window closed before the capture');
    await shown(splash);
    await delay(SPLASH_CAPTURE_DELAY_MS);
    if (splash.isDestroyed()) throw new Error('the splash window closed before the capture');
    ctx.log(`splash screenshot written: ${await captureWindow(splash, name)}`);
  } catch (err) {
    ctx.log(`splash screenshot failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
  }
};

const armSplashScreenshotFlag = (ctx: MainContext): void => {
  const name = ctx.flags.flagValue(SPLASH_SCREENSHOT_FLAG);
  if (!name) return;
  const endsItself = ctx.flags.hasFlag(REVIEW_FLAG) || ctx.flags.flagValue('--screenshot') !== null;
  bootState.holds.push(new Promise<void>((resolve) => {
    bootEvents.once('progress', () => { void captureSplash(ctx, name).finally(resolve); });
  }));
  bootEvents.once('failed', () => {
    void captureSplash(ctx, `${name}-failed`).finally(() => { if (!endsItself) app.exit(1); });
  });
  if (!endsItself) void whenRevealed().then(() => app.quit());
};

export { armSplashScreenshotFlag };
