/* @layer renderer-shell @kind logic */
import { appLogState } from './app-log-state';
import type { AppLogBus } from './app-log.type';
import { createAppLog } from './create-app-log';

const getAppLog = (): AppLogBus => appLogState.bus ?? createAppLog();

export { getAppLog };
