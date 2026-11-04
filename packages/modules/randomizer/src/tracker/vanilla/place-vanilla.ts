/* @layer core @kind logic */
import { sweepPlacementSpheres } from '../../world';
import type { World, WorldKeys, WorldLocation } from '../../world';
import type { VanillaPlacement } from '../types/vanilla-placement.type';

const placeVanilla = <K extends WorldKeys>(
  world: World<K>, contentOf: (location: WorldLocation<K>) => K['item'] | undefined,
): VanillaPlacement<K> => {
  const locations = new Map<K['location'], K['item']>();
  for (const region of world.regions.values()) {
    for (const location of region.locations) {
      const item = contentOf(location);
      if (item === undefined) throw new Error(`no original item recorded for location: ${location.key}`);
      locations.set(location.key, item);
    }
  }
  for (const [key, item] of locations) world.placedItems.set(key, item);
  const { spheres } = sweepPlacementSpheres(world);
  return { locations, spheres };
};

export { placeVanilla };
