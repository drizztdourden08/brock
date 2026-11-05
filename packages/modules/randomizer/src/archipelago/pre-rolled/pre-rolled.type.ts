/* @layer core @kind types */
import type { ModelFillWorld, WorldModel, WorldModelHooks } from '../world-model';
import type { WorldKeys } from '../../world';

type PreRolled = { world: WorldModel } & Readonly<Record<string, unknown>>;

interface PreRolledInput<K extends WorldKeys = WorldKeys> {
  fillWorld: ModelFillWorld<K>;
  options: Record<string, unknown>;
  hooks: WorldModelHooks<K>;
  sections?: (fillWorld: ModelFillWorld<K>) => Record<string, unknown>;
}

export type { PreRolled, PreRolledInput };
