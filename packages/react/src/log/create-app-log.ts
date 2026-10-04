/* @layer renderer-shell @kind logic */
import { createLogBus } from '@drizztdourden08/brock-core';
import { BASE_CHANNELS } from './app-log.constants';
import { appLogState } from './app-log-state';
import type { AppLogBus } from './app-log.type';

const createAppLog = (channels: readonly string[] = []): AppLogBus => {
  const bus = createLogBus({ channels: [...new Set([...BASE_CHANNELS, ...channels])] });
  appLogState.bus = bus;
  appLogState.counts = { warn: 0, error: 0 };
  bus.subscribe((entry) => {
    if (entry.level === 'warn' || entry.level === 'error') appLogState.counts[entry.level] += 1;
  });
  return bus;
};

export { createAppLog };
