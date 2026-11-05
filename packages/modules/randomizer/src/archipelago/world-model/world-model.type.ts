/* @layer core @kind types */
import type { ItemClass } from '../export';
import type { HelperRegistry, RuleOptionValue, SeedValue, World, WorldKeys, WorldLocation } from '../../world';

interface ModelFillWorld<K extends WorldKeys = WorldKeys> {
  world: World<K>;
  pool: {
    progression: readonly string[];
    useful: readonly string[];
    filler: readonly string[];
  };
  lockedVanilla: ReadonlyMap<string, string>;
}

interface DungeonItemEntry {
  item: string;
  dungeon: string | null;
  rank: number;
}

interface WorldModelCore {
  options: Record<string, unknown>;
  present: string[];
  locked: Record<string, string>;
  pool: Record<string, number>;
  dungeonItems: DungeonItemEntry[];
  classes: Record<string, ItemClass>;
  forbidden: Record<string, string[]>;
  fillerItem: string;
  readings: Record<string, RuleOptionValue>;
  seedValues: Record<string, SeedValue>;
  primitives: Record<string, unknown>;
}

type WorldModel = WorldModelCore & Readonly<Record<string, unknown>>;

interface WorldModelHooks<K extends WorldKeys = WorldKeys> {
  helpers: HelperRegistry<World<K>>;
  readings: (world: World<K>) => Record<string, RuleOptionValue>;
  primitives: (world: World<K>) => Record<string, unknown>;
  primitiveItems: (helper: string, primitives: Record<string, unknown>) => readonly string[];
  classify: (item: string, fillWorld: ModelFillWorld<K>) => ItemClass;
  lockedExtra?: (fillWorld: ModelFillWorld<K>) => Record<string, string>;
  isFixedLocation?: (location: WorldLocation<K>) => boolean;
  fixedProgression?: (fillWorld: ModelFillWorld<K>) => ReadonlySet<string>;
  dungeonItems?: (fillWorld: ModelFillWorld<K>) => readonly DungeonItemEntry[];
  extras?: (fillWorld: ModelFillWorld<K>) => Record<string, unknown>;
}

interface WorldModelInput<K extends WorldKeys = WorldKeys> {
  fillWorld: ModelFillWorld<K>;
  options: Record<string, unknown>;
  hooks: WorldModelHooks<K>;
}

type ItemHalf = Pick<WorldModelCore, 'pool' | 'dungeonItems' | 'classes' | 'forbidden' | 'fillerItem'>;

interface ItemHalfInput<K extends WorldKeys = WorldKeys> {
  fillWorld: ModelFillWorld<K>;
  fillable: readonly string[];
  fixedProgression: ReadonlySet<string>;
  read: ReadonlySet<string>;
  locked: Iterable<string>;
  hooks: WorldModelHooks<K>;
}

export type {
  DungeonItemEntry, ItemHalf, ItemHalfInput, ModelFillWorld, WorldModel, WorldModelCore, WorldModelHooks, WorldModelInput,
};
