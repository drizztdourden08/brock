/* @layer core @kind types */
type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry<C extends string = string> {
  id: number;
  timestamp: number;
  channel: C | 'app' | 'error';
  level: LogLevel;
  message: string;
}

type LogListener<C extends string> = (entry: LogEntry<C>) => void;

interface LogBusOptions<C extends string> {
  channels: readonly C[];
  maxEntries?: number;
  mirrorToConsole?: boolean;
}

interface LogBus<C extends string> {
  channels: readonly (C | 'app' | 'error')[];
  log: (channel: C | 'app', message: string, level?: LogLevel) => void;
  error: (message: string) => void;
  subscribe: (listener: LogListener<C>) => () => void;
  getEntries: () => LogEntry<C>[];
  reset: () => void;
}

export type { LogBus, LogBusOptions, LogEntry, LogLevel, LogListener };
