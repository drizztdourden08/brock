/* @layer core @kind logic */
import type { DefPlacement, GameWorldDef, World, WorldKeys } from '../../world';
import { createWorldFromDef } from '../../world/define/create-world-from-def';

const defWorldOf = <K extends WorldKeys>(def: GameWorldDef<K>, placement: DefPlacement<K>): World<K> => {
  const world = createWorldFromDef(def, { seed: placement.seed });
  for (const [location, item] of placement.locations) world.placedItems.set(location, item);
  return world;
};

export { defWorldOf };
