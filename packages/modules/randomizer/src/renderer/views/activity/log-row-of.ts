/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { classifyEntry } from './classify-entry';
import { formatTime } from '../dashboard/format-time';

const logRowOf = (entry: LogEntry, rules: readonly LogRule[]): LogRow => {
  const { kind, tag } = classifyEntry(entry, rules);
  return { id: String(entry.id), gutter: formatTime(entry.timestamp), tag, kind, message: entry.message };
};

export { logRowOf };
