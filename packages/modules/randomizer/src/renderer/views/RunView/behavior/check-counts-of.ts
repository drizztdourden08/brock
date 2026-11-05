/* @layer renderer-shell @kind logic */
import type { NetworkStatus } from '../../../../archipelago';
import type { TrackerCounts } from '../../../../tracker';
import type { CheckCounts } from './check-counts.type';

const checkCountsOf = (tracker: TrackerCounts | null, room: NetworkStatus['progress'] | null): CheckCounts | null => {
  if (tracker !== null && tracker.total > 0) {
    return { taken: tracker.checked, available: tracker.available, left: tracker.blocked, total: tracker.total };
  }
  if (room !== null && room.total > 0) return { taken: room.checked, available: null, left: null, total: room.total };
  return null;
};

export { checkCountsOf };
