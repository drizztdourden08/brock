/* @layer renderer-shell @kind logic */
import type { TrackerProvider, TrackerReading } from '../../../../tracker';
import type { TrackerFeedInput } from '../../../tracker/feed/tracker-feed-state.type';
import type { CheckRow } from '../../ChecksView/behavior/check-row.type';
import { rowsOf } from '../../ChecksView/behavior/rows-of';
import { NO_MARKS, TOAST_GROUPING } from '../CheckToasts.constants';

const toastRowsOf = (
  provider: TrackerProvider<unknown> | undefined,
  reading: TrackerReading | null,
  feed: TrackerFeedInput,
  keys: readonly string[],
): CheckRow[] => {
  if (provider === undefined || reading === null || keys.length === 0) return [];
  const wanted = new Set(keys);
  return rowsOf({ provider, reading, feed, marks: NO_MARKS, grouping: TOAST_GROUPING })
    .filter((row) => wanted.has(row.key) && row.kind !== 'event');
};

export { toastRowsOf };
