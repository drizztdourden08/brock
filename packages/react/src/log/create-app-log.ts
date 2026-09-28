/* @layer renderer-shell @kind logic */
import { createLogBus } from '@drizztdourden08/brock-core';
import { BASE_CHANNELS } from './app-log.constants';
import { appLogState } from './app-log-state';
import type { AppLogBus } from './app-log.type';

const createAppLog = (channels: readonly string[] = []): AppLogBus => {
  appLogState.bus = createLogBus({ channels: [...new Set([...BASE_CHANNELS, ...channels])] });
  return appLogState.bus;
};

export { createAppLog };
