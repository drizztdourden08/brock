/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';

const sessionLogLine = (entry: LogEntry): string =>
  `[${new Date(entry.timestamp).toISOString()}] [${entry.level}] [${entry.channel}] ${entry.message}`;

export { sessionLogLine };
