/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../host/host-api';
import type { AppLogBus } from './app-log.type';
import { catchGlobalErrors } from './catch-global-errors';
import type { RendererLogging } from './session-log.type';
import { writeSessionLog } from './write-session-log';

const useRendererLogging = (bus: AppLogBus, options: RendererLogging): void => {
  const writes = options.sessionLog !== false && !options.popped;
  useEffect(() => catchGlobalErrors(bus, window), [bus]);
  useEffect(() => {
    const append = hostApi()?.appendSessionLog;
    if (!writes || !append) return undefined;
    return writeSessionLog(bus, (lines) => append(lines), window);
  }, [bus, writes]);
};

export { useRendererLogging };
