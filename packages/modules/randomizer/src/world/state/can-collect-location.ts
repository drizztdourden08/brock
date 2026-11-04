/* @layer core @kind logic */
import type { CollectionState, World, WorldKeys } from '../types';

const canCollectLocation = <K extends WorldKeys>(
  state: CollectionState<World<K>>,
  key: K['location'],
): boolean => {
  const location = state.world.locationsByKey.get(key);
  if (location === undefined) return false;
  if (!state.canReachRegion(location.region)) return false;
  const rule = state.world.getLocationRule(key);
  return rule === undefined || rule(state);
};

export { canCollectLocation };
