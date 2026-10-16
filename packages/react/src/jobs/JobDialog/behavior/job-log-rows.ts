/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { JobLogLine } from '@drizztdourden08/brock-core/types';
import { formatLogTime } from '../../../diagnostics/format-log-time';

const jobLogRows = (log: readonly JobLogLine[]): LogRow[] => log.map((line, index) => ({
  id: `${index}`,
  gutter: formatLogTime(line.at),
  tag: line.level,
  kind: line.level,
  message: line.message,
}));

export { jobLogRows };
