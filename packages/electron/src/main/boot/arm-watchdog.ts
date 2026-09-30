/* @layer electron-main @kind logic */
import { bootState } from './boot-state';
import { INTERFACE_TASK } from './reveal.constants';
import { reportBootFailure } from './report-boot-failure';

const armWatchdog = (): void => {
  if (bootState.watchdog) clearTimeout(bootState.watchdog);
  bootState.watchdog = null;
  if (!bootState.app || bootState.rendererReady || bootState.failure || bootState.revealed) return;
  const seconds = Math.round(bootState.watchdogMs / 1000);
  bootState.watchdog = setTimeout(() => {
    reportBootFailure({ ...INTERFACE_TASK, side: 'renderer', message: `The interface sent nothing for ${seconds} s and looks stuck`, timedOut: true });
  }, bootState.watchdogMs);
};

export { armWatchdog };
