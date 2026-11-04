/* @layer core @kind logic */
import { updateReachableRegions } from './update-reachable-regions';
import type { CollectionState, World, WorldKeys } from '../types';

const computeReachableRegions = <K extends WorldKeys>(
  state: CollectionState<World<K>>,
  world: World<K>,
): Set<K['region']> => {
  state.staleReachability = true;
  updateReachableRegions(state, world);
  return new Set(state.reachableRegions);
};

export { computeReachableRegions };
