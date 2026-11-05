/* @layer core @kind logic */
import { readItemsOf } from '../export';
import { itemHalfOf } from './model-items';
import { lockedOf } from './locked-of';
import { specializedTrees } from './specialized-trees';
import type { WorldKeys } from '../../world';
import type { WorldModel, WorldModelInput } from './world-model.type';

const worldModelOf = <K extends WorldKeys>(input: WorldModelInput<K>): WorldModel => {
  const { fillWorld, options, hooks } = input;
  const { world } = fillWorld;
  const locked = lockedOf(fillWorld, hooks);
  const primitives = hooks.primitives(world);
  const fixed = hooks.isFixedLocation;
  const fillable = [...world.locationsByKey.values()]
    .filter((location) => !fixed?.(location) && locked[location.key] === undefined)
    .map((location) => location.key);
  const items = itemHalfOf({
    fillWorld,
    fillable,
    fixedProgression: hooks.fixedProgression?.(fillWorld) ?? new Set<string>(),
    read: readItemsOf(specializedTrees(fillWorld, hooks), (helper) => hooks.primitiveItems(helper, primitives)),
    locked: Object.values(locked),
    hooks,
  });
  return {
    options,
    present: [...world.locationsByKey.keys()],
    locked,
    ...items,
    readings: hooks.readings(world),
    seedValues: Object.fromEntries(world.seedValues),
    primitives,
    ...hooks.extras?.(fillWorld),
  };
};

export { worldModelOf };
