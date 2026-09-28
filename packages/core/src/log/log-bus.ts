/* @layer core @kind logic */
import type { LogBus, LogBusOptions, LogEntry, LogLevel, LogListener } from './log-bus.type';

const createLogBus = <C extends string>(opts: LogBusOptions<C>): LogBus<C> => {
  const max = opts.maxEntries ?? 1000;
  const mirror = opts.mirrorToConsole ?? true;
  const entries: LogEntry<C>[] = [];
  const listeners = new Set<LogListener<C>>();
  let nextId = 0;

  const emit = (channel: C | 'app' | 'error', level: LogLevel, message: string): void => {
    const entry: LogEntry<C> = { id: nextId++, timestamp: Date.now(), channel, level, message };
    entries.push(entry);
    if (entries.length > max) entries.shift();
    for (const listener of listeners) {
      try { listener(entry); } catch { continue; }
    }
    if (!mirror) return;
    const line = `[${channel}] ${message}`;
    if (level === 'error') console.error(line);
    else if (level === 'warn') console.warn(line);
    else console.log(line);
  };

  return {
    channels: [...opts.channels, 'app', 'error'],
    log: (channel, message, level = 'info') => emit(channel, level, message),
    error: (message) => emit('error', 'error', message),
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getEntries: () => [...entries],
    reset: () => { entries.length = 0; },
  };
};

export { createLogBus };
