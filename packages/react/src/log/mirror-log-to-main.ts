/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';
import { appLogState } from './app-log-state';
import type { AppLogBus } from './app-log.type';
import { mirrorLogLine } from './mirror-log-line';

const mirrorLogToMain = (bus: AppLogBus): (() => void) =>
  bus.subscribe((entry) => {
    if (entry.level !== 'warn' && entry.level !== 'error') return;
    if (appLogState.bridging) return;
    hostApi()?.mirrorLog?.([mirrorLogLine(entry)]);
  });

export { mirrorLogToMain };
