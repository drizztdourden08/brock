/* @layer core @kind logic */
import type { CollectionState, Region, World, WorldKeys } from '../types';

const openExitsOf = <K extends WorldKeys>(
  region: Region<K>,
  state: CollectionState<World<K>>,
  world: World<K>,
): boolean => {
  const reachable = state.reachableRegions;
  let changed = false;
  for (const exit of region.exits) {
    if (reachable.has(exit.target)) continue;
    const rule = world.getRule(exit.name);
    if (rule === undefined || rule(state)) {
      reachable.add(exit.target);
      changed = true;
    }
  }
  return changed;
};

export { openExitsOf };
