/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';
import { formatClockTime } from './format-clock-time';

const formatLogLine = (entry: LogEntry, maxLength = Infinity): string => {
  const line = `${formatClockTime(entry.timestamp)} ${entry.level.toUpperCase()} [${entry.channel}] ${entry.message}`;
  return line.length > maxLength ? `${line.slice(0, maxLength)}...` : line;
};

export { formatLogLine };
