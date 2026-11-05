/* @layer core @kind logic */
import type { ModelFillWorld, WorldModelHooks } from './world-model.type';
import type { WorldKeys } from '../../world';

const lockedOf = <K extends WorldKeys>(
  fillWorld: ModelFillWorld<K>, hooks: WorldModelHooks<K>,
): Record<string, string> => ({
  ...Object.fromEntries(fillWorld.lockedVanilla),
  ...hooks.lockedExtra?.(fillWorld),
});

export { lockedOf };
