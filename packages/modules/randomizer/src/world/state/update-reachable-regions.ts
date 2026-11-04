/* @layer core @kind logic */
import { openExitsOf } from './open-exits-of';
import type { CollectionState, World, WorldKeys } from '../types';

const updateReachableRegions = <K extends WorldKeys>(
  state: CollectionState<World<K>>,
  world: World<K>,
): void => {
  if (!state.staleReachability) return;
  state.staleReachability = false;
  const reachable = state.reachableRegions;
  reachable.clear();
  if (world.regions.has(world.start)) reachable.add(world.start);
  let changed = true;
  while (changed) {
    changed = false;
    for (const region of world.regions.values()) {
      if (reachable.has(region.id) && openExitsOf(region, state, world)) changed = true;
    }
  }
};

export { updateReachableRegions };
