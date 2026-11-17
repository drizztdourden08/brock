/* @layer electron-main @kind logic */
import { logBoot } from '../bootstrap/boot-timing';
import { bootState } from './boot-state';
import { INTERFACE_TASK } from './reveal.constants';
import { reportBootFailure } from './report-boot-failure';

const armWatchdog = (): void => {
  const wasArmed = bootState.watchdog !== null;
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  if (!bootState.app || bootState.rendererReady || bootState.failure || bootState.revealed) {
    if (wasArmed) logBoot('watchdog cleared');
    return;
  }
  if (!wasArmed) logBoot(`watchdog armed (${bootState.watchdogMs}ms)`);
  const seconds = Math.round(bootState.watchdogMs / 1000);
  bootState.watchdog = setTimeout(() => {
    logBoot('watchdog fired');
    reportBootFailure({ ...INTERFACE_TASK, side: 'renderer', message: `The interface sent nothing for ${seconds} s and looks stuck`, timedOut: true, watchdog: true });
  }, bootState.watchdogMs);
};

export { armWatchdog };
