/* @layer core @kind types */
import type {
  CollectionHooks, CollectionState, FillBuild, FillPhase, HelperDefinition, ItemRule, Region, RuleNode,
  RuleOptionValue, SchemaSet, World, WorldKeys,
} from '../types';
import type { DefPool } from './def-pool.type';
import type { DefPoolContext } from './def-pool-context.type';

interface GameWorldDef<K extends WorldKeys = WorldKeys> {
  game: string;
  worldSchema: string;
  placementSchemas: SchemaSet;
  optionSchemas: SchemaSet;
  maxAttempts?: number;
  start: K['region'];
  sweepsEvents?: boolean;
  regions: readonly Region<K>[];
  exitRules?: ReadonlyMap<string, RuleNode<K>>;
  locationRules?: ReadonlyMap<K['location'], RuleNode<K>>;
  eventRules?: ReadonlyMap<K['event'], RuleNode<K>>;
  itemRules?: ReadonlyMap<K['location'], ItemRule<K>>;
  helpers?: readonly HelperDefinition<World<K>>[];
  collection?: CollectionHooks<World<K>>;
  options?: (request: { seed: string }) => Readonly<Record<string, RuleOptionValue>>;
  goal: (state: CollectionState<World<K>>) => boolean;
  buildPool: (ctx: DefPoolContext<K>) => DefPool<K>;
  fillPhases?: readonly FillPhase<FillBuild<World<K>>>[];
}

export type { GameWorldDef };
