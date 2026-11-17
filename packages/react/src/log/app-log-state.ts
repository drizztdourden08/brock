/* @layer renderer-shell @kind logic */
import type { AppLogState } from './app-log.type';

const appLogState: AppLogState = { bus: null, counts: { warn: 0, error: 0 }, disarm: null, bridging: false };

export { appLogState };
