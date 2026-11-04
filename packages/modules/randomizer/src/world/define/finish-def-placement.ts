/* @layer core @kind logic */
import { FillError } from '../fill/fill-error';
import type { PlacementSweep, World, WorldKeys } from '../types';
import type { DefPlacement } from './def-placement.type';

const finishDefPlacement = <K extends WorldKeys>(
  world: World<K>, sweep: PlacementSweep<World<K>>, seed: string, attempts: number,
): DefPlacement<K> => {
  if (!sweep.beaten) {
    throw new FillError('goal', `not beatable, ${sweep.uncollected.length} locations unreachable`);
  }
  return { seed, attempts, locations: [...world.placedItems], spheres: sweep.spheres };
};

export { finishDefPlacement };
