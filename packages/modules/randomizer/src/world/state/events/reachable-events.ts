/* @layer core @kind logic */
import { canReachEvent } from './can-reach-event';
import type { CollectionState, World, WorldKeys } from '../../types';

const reachableEvents = <K extends WorldKeys>(state: CollectionState<World<K>>): K['event'][] => {
  if (!state.world.sweepsEvents) return [];
  return [...state.world.eventsByKey.keys()].filter(
    (key) => !state.has(key) && canReachEvent(state, key),
  );
};

export { reachableEvents };
