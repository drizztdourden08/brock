/* @layer core @kind logic */
import { reachableEvents } from './reachable-events';
import type { CollectionState, World, WorldKeys } from '../../types';

const collectReachableEvents = <K extends WorldKeys>(state: CollectionState<World<K>>): void => {
  for (let batch = reachableEvents(state); batch.length > 0; batch = reachableEvents(state)) {
    for (const key of batch) state.collect(key);
  }
};

export { collectReachableEvents };
