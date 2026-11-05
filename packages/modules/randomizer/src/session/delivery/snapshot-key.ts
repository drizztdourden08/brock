/* @layer core @kind logic */
import { SNAPSHOT_KEY_SEPARATOR } from './delivery-feed.constants';
import type { QueueState } from './queue-state.type';

const snapshotKey = <A>(state: QueueState<A>): string =>
  [state.delivering?.id ?? '', ...state.queue.map((entry) => entry.id)].join(SNAPSHOT_KEY_SEPARATOR);

export { snapshotKey };
