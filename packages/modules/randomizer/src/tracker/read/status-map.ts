/* @layer core @kind logic */
import type { World } from '../../world';
import type { LocationStatus } from '../types/location-status.type';

const statusMap = (
  world: World, checked: ReadonlySet<string>, available: ReadonlySet<string>,
): Map<string, LocationStatus> => {
  const statuses = new Map<string, LocationStatus>();
  for (const key of world.locationsByKey.keys()) {
    if (checked.has(key)) statuses.set(key, 'checked');
    else statuses.set(key, available.has(key) ? 'available' : 'blocked');
  }
  return statuses;
};

export { statusMap };
