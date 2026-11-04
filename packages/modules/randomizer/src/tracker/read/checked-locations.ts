/* @layer core @kind logic */
import type { World } from '../../world';
import type { TrackerProvider } from '../types/tracker-provider.type';

const checkedLocations = <P>(provider: TrackerProvider<P>, world: World, raw: Iterable<string>): Set<string> => {
  const checked = new Set<string>();
  for (const key of raw) {
    const location = provider.locationOf === undefined ? key : provider.locationOf(key);
    if (location !== null && world.locationsByKey.has(location)) checked.add(location);
  }
  return checked;
};

export { checkedLocations };
