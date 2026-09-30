/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { MainContext } from '../types/main-context.type';
import { captureWindow } from '../handlers/capture-window';
import { bootEvents } from '../boot/boot-events';
import { whenRevealed } from '../boot/when-revealed';
import { SCREENSHOT_WATCHDOG_MS } from './screenshot-flag.constants';

const armScreenshotFlag = (ctx: MainContext): void => {
  const name = ctx.flags.flagValue('--screenshot');
  if (!name) return;

  let done = false;
  const shoot = async (): Promise<void> => {
    if (done) return;
    done = true;
    try {
      const win = ctx.window();
      if (!win) throw new Error('no window to capture');
      ctx.log(`screenshot written: ${await captureWindow(win, name)}`);
    } catch (err) {
      ctx.log(`screenshot failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
    app.quit();
  };

  void whenRevealed().then(shoot);
  bootEvents.once('failed', () => {
    done = true;
    app.exit(1);
  });
  setTimeout(() => { void shoot(); }, SCREENSHOT_WATCHDOG_MS).unref();
};

export { armScreenshotFlag };
