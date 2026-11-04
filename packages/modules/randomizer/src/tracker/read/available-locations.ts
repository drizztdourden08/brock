/* @layer core @kind logic */
import { canCollectLocation } from '../../world';
import type { CollectionState, World } from '../../world';

const availableLocations = (state: CollectionState, world: World, checked: ReadonlySet<string>): Set<string> => {
  const available = new Set<string>();
  for (const key of world.locationsByKey.keys()) {
    if (checked.has(key)) continue;
    if (canCollectLocation(state, key)) available.add(key);
  }
  return available;
};

export { availableLocations };
