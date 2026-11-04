/* @layer core @kind logic */
import type { DefPlacement, GameWorldDef, WorldKeys } from '../../world';
import type { DefTrackerExtras } from '../types/def-tracker-extras.type';
import type { TrackerProvider } from '../types/tracker-provider.type';
import { defVanillaPlacement } from './def-vanilla-placement';
import { defWorldOf } from './def-world-of';

const trackerFromDef = <K extends WorldKeys>(
  def: GameWorldDef<K>, extras: DefTrackerExtras<K>,
): TrackerProvider<DefPlacement<K>> => ({
  ...extras,
  world: (input) => defWorldOf(def, input.placement),
  vanilla: () => defVanillaPlacement(def),
  sphereOf: (placement) => {
    const spheres = new Map<string, number>();
    for (const sphere of placement.spheres) {
      for (const location of sphere.locations) spheres.set(location, sphere.index);
    }
    return spheres;
  },
});

export { trackerFromDef };
