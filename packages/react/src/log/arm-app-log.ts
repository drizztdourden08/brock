/* @layer renderer-shell @kind logic */
import { appLogState } from './app-log-state';
import type { AppLogBus } from './app-log.type';
import { catchGlobalErrors } from './catch-global-errors';
import { mirrorLogToMain } from './mirror-log-to-main';

const armAppLog = (bus: AppLogBus): void => {
  appLogState.disarm?.();
  appLogState.disarm = null;
  if (typeof window === 'undefined') return;
  const stopCatch = catchGlobalErrors(bus, window);
  const stopMirror = mirrorLogToMain(bus);
  appLogState.disarm = () => {
    stopCatch();
    stopMirror();
  };
};

export { armAppLog };
