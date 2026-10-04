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

type LogGlobals = Window & { __logEntries?: () => unknown; __logSubscribe?: unknown };

export type { AppLogBus, AppLogState, LogGlobals, LogLevelCounts };
