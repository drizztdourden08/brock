/* @layer core @kind logic */
import { canCollectLocation, reachableEvents } from '../state';
import type { AssumedState, KeysOf, World } from '../types';

const sweepPlacedItems = <W extends World>(assumed: AssumedState<W>): void => {
  const { state, collectedLocations } = assumed;
  const { placedItems } = state.world;
  let changed = true;
  while (changed) {
    changed = false;
    const batch: KeysOf<W>['location'][] = [];
    for (const key of placedItems.keys()) {
      if (!collectedLocations.has(key) && canCollectLocation(state, key)) batch.push(key);
    }
    const events = reachableEvents(state);
    for (const key of batch) {
      collectedLocations.add(key);
      const item = placedItems.get(key);
      if (item !== undefined) state.collect(item);
      changed = true;
    }
    for (const event of events) state.collect(event);
    if (events.length > 0) changed = true;
  }
};

export { sweepPlacedItems };
