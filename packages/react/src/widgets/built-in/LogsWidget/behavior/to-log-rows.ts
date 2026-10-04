/* @layer renderer-shell @kind logic */
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import { formatClockTime } from '../../../../diagnostics/format-clock-time';

const toLogRows = (entries: readonly LogEntry[]): LogRow[] =>
  entries.map((entry) => ({
    id: String(entry.id),
    gutter: formatClockTime(entry.timestamp),
    tag: entry.channel,
    kind: entry.level,
    message: entry.message,
  }));

export { toLogRows };
