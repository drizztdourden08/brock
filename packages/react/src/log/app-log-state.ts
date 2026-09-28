/* @layer renderer-shell @kind logic */
import type { AppLogBus } from './app-log.type';

const appLogState: { bus: AppLogBus | null } = { bus: null };

export { appLogState };
