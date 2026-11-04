/* @layer core @kind logic */
import { itemAt } from '../util';
import { fillRestrictive } from './fill-restrictive';
import type { Rng } from '../rng';
import type { FillBuild, World } from '../types';

const runMainFill = <W extends World>(build: FillBuild<W>, rng: Rng): void => {
  const { world, relaxWhenBeatable } = build;
  const openLocations = rng.shuffle(build.eligible());
  const progression = rng.shuffle(build.progression);
  fillRestrictive({
    world, items: progression, locations: openLocations, assumedItems: [], relaxWhenBeatable,
  });
  const rest = rng.shuffle(build.rest);
  if (openLocations.length !== rest.length) {
    throw new Error(`junk fill imbalance: ${openLocations.length} open vs ${rest.length} items`);
  }
  openLocations.forEach((location, index) => world.placedItems.set(location, itemAt(rest, index)));
};

export { runMainFill };
