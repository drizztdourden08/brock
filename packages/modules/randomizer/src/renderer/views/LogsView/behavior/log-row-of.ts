/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';

const logRowOf = (entry: LogEntry): LogRow => ({
  id: String(entry.id),
  gutter: formatDate(entry.timestamp, 'time', { length: 'medium' }),
  tag: entry.channel.toUpperCase(),
  kind: entry.level,
  message: entry.message,
});

export { logRowOf };
