/* @layer core @kind logic */
import { canCollectLocation, createCollectionState, reachableEvents } from '../state';
import type { KeysOf, PlacementSphere, PlacementSweep, World } from '../types';

const sweepPlacementSpheres = <W extends World>(world: W): PlacementSweep<W> => {
  const state = createCollectionState(world);
  const collected = new Set<KeysOf<W>['location']>();
  const spheres: PlacementSphere<W>[] = [];
  for (;;) {
    const batch = [...world.locationsByKey.keys()]
      .filter((key) => !collected.has(key) && canCollectLocation(state, key));
    const events = reachableEvents(state);
    if (batch.length === 0 && events.length === 0) break;
    for (const key of batch) {
      collected.add(key);
      const item = world.placedItems.get(key);
      if (item !== undefined) state.collect(item);
    }
    for (const event of events) state.collect(event);
    if (batch.length > 0) spheres.push({ index: spheres.length, locations: batch });
  }
  const uncollected = [...world.locationsByKey.keys()].filter((key) => !collected.has(key));
  const missedEvents = [...world.eventsByKey.keys()].filter((key) => !state.has(key));
  return { spheres, collected, uncollected, missedEvents, beaten: world.isBeaten(state) };
};

export { sweepPlacementSpheres };
