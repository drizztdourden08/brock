/* @layer renderer-shell @kind types */
import type { LogBus } from '@drizztdourden08/brock-core';

type AppLogBus = LogBus<string>;

type LogGlobals = Window & { __logEntries?: () => unknown; __logSubscribe?: unknown };

export type { AppLogBus, LogGlobals };
