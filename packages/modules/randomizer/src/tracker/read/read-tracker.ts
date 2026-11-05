/* @layer core @kind logic */
import { computeReachableRegions, createCollectionState } from '../../world';
import type { TrackerInput } from '../types/tracker-input.type';
import type { TrackerProvider } from '../types/tracker-provider.type';
import type { TrackerReading } from '../types/tracker-reading.type';
import { availableLocations } from './available-locations';
import { collectChecked } from './collect-checked';
import { collectHeld } from './collect-held';
import { countStatuses } from './count-statuses';
import { statusMap } from './status-map';
import { cachedWorld } from './world-cache';

const readTracker = <P>(provider: TrackerProvider<P>, input: TrackerInput<P>): TrackerReading => {
  const world = cachedWorld(provider, input);
  const state = createCollectionState(world);
  collectChecked(state, world, input.checked);
  const assumedItems = provider.assumedHeld === undefined ? [] : provider.assumedHeld(input.assumed);
  collectHeld(state, [...input.held, ...assumedItems]);
  provider.prime?.(state, input);
  const available = availableLocations(state, world, input.checked);
  const statuses = provider.statusesOf?.(input) ?? statusMap(world, input.checked, available);
  return {
    world,
    statuses,
    reachableRegions: computeReachableRegions(state, world),
    counts: countStatuses(statuses),
  };
};

export { readTracker };
