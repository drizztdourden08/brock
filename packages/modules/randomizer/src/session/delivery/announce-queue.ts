/* @layer core @kind logic */
import { feedState } from './feed-state';
import type { QueueState } from './queue-state.type';
import { snapshotKey } from './snapshot-key';
import { snapshotOf } from './snapshot-of';

const announceQueue = <A>(state: QueueState<A>): void => {
  const key = snapshotKey(state);
  const { held } = feedState;
  if (key === held.key) return;
  held.key = key;
  held.snapshot = snapshotOf(state);
  for (const listener of [...feedState.listeners]) listener();
};

export { announceQueue };
