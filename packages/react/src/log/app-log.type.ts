/* @layer renderer-shell @kind types */
import type { LogBus } from '@drizztdourden08/brock-core';

type AppLogBus = LogBus<string>;

interface LogLevelCounts {
  warn: number;
  error: number;
}

interface AppLogState {
  bus: AppLogBus | null;
  counts: LogLevelCounts;
}

export type { AppLogBus, AppLogState, LogLevelCounts };
