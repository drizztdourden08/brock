/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';

const mirrorLogLine = (entry: LogEntry): string => `[renderer] ${entry.level} ${entry.channel}: ${entry.message}`;

export { mirrorLogLine };
