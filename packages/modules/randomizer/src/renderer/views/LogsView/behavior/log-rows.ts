/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';
import { logRowOf } from './log-row-of';

const logRowsOf = (entries: readonly LogEntry[]): LogRow[] => entries.map(logRowOf);

export { logRowsOf };
