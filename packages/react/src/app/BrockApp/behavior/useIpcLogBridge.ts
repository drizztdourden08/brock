/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { LogLevel } from '@drizztdourden08/brock-core';
import { hostApi } from '../../../host/host-api';
import type { AppLogBus } from '../../../log/app-log.type';
import { LEVELS } from '../BrockApp.constants';

const asLevel = (level: string): LogLevel => (LEVELS as readonly string[]).includes(level) ? (level as LogLevel) : 'info';

const useIpcLogBridge = (bus: AppLogBus): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api?.onLogEntry) return;
    return api.onLogEntry((entry) => {
      const channel = bus.channels.includes(entry.channel) ? entry.channel : 'ipc';
      bus.log(channel, entry.message, asLevel(entry.level));
    });
  }, [bus]);
};

export { useIpcLogBridge };
