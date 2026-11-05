/* @layer core @kind logic */
import type { DeliveryEntry } from './delivery-entry.type';
import type { DeliveryLine, DeliverySnapshot } from './delivery-feed.type';
import type { QueueState } from './queue-state.type';

const lineOf = <A>({ id, request }: DeliveryEntry<A>): DeliveryLine => ({ id, message: request.message, source: request.source });

const snapshotOf = <A>(state: QueueState<A>): DeliverySnapshot => ({
  pending: state.queue.map(lineOf),
  delivering: state.delivering === null ? null : lineOf(state.delivering),
});

export { snapshotOf };
