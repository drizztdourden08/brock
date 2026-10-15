/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { MainContext } from '../types/main-context.type';
import { captureWindow } from '../handlers/capture-window';
import { captureHolds } from '../handlers/capture-holds';
import { bootEvents } from '../boot/boot-events';
import { whenRevealed } from '../boot/when-revealed';
import { SCREENSHOT_TIMEOUT_EXIT_CODE, SCREENSHOT_TIMEOUT_FLAG, SCREENSHOT_WATCHDOG_MS } from './screenshot-flag.constants';
import { screenshotTimeoutMs } from './screenshot-timeout-ms';

const watchdogLine = (timeoutMs: number, revealed: boolean): string => {
  const why = revealed ? `${captureHolds.count()} screenshot hold(s) still open` : 'the window was never revealed';
  return `the screenshot watchdog fired after ${timeoutMs / 1000} s (${why}); captured what there was and exiting ${SCREENSHOT_TIMEOUT_EXIT_CODE}`;
};

const armScreenshotFlag = (ctx: MainContext, defaultTimeoutMs = SCREENSHOT_WATCHDOG_MS): void => {
  const name = ctx.flags.flagValue('--screenshot');
  if (!name) return;
  const timeout = screenshotTimeoutMs(ctx.flags.flagValue(SCREENSHOT_TIMEOUT_FLAG), defaultTimeoutMs);
  if (timeout.problem) ctx.log(timeout.problem, 'warn');

  let done = false;
  let revealed = false;
  const shoot = async (timedOut: boolean): Promise<void> => {
    if (done) return;
    done = true;
    try {
      const win = ctx.window();
      if (!win) throw new Error('no window to capture');
      ctx.log(`screenshot written: ${await captureWindow(win, name)}`);
    } catch (err) {
      ctx.log(`screenshot failed: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
    if (!timedOut) return app.quit();
    ctx.log(watchdogLine(timeout.ms, revealed), 'error');
    return app.exit(SCREENSHOT_TIMEOUT_EXIT_CODE);
  };

  void whenRevealed().then(() => { revealed = true; }).then(captureHolds.settled).then(() => shoot(false));
  bootEvents.once('failed', () => {
    done = true;
    app.exit(1);
  });
  setTimeout(() => { void shoot(true); }, timeout.ms).unref();
};

export { armScreenshotFlag };
