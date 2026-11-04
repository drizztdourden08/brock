/* @layer core @kind logic */
import type { DefPlacement, GameWorldDef, WorldKeys } from '../../world';
import { createWorldFromDef } from '../../world/define/create-world-from-def';
import { placeVanilla } from '../vanilla/place-vanilla';
import { VANILLA_ATTEMPTS, VANILLA_SEED } from './def.constants';

const defVanillaPlacement = <K extends WorldKeys>(def: GameWorldDef<K>): DefPlacement<K> => {
  const world = createWorldFromDef(def, { seed: VANILLA_SEED });
  const { locations, spheres } = placeVanilla(world, (location) => location.vanillaItem);
  return { seed: VANILLA_SEED, attempts: VANILLA_ATTEMPTS, locations: [...locations], spheres };
};

export { defVanillaPlacement };
