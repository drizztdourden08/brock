/* @layer core @kind types */
import type {
  CollectionState, FillBuild, FillPhase, OptionRef, Rule, RuleArg, RuleCount, RuleNode, RuleOptionValue, World,
  WorldKeys,
} from '../types';
import type { KitHelperRegistry } from './kit-helper-registry.type';

interface WorldKit<K extends WorldKeys> {
  all(...of: readonly RuleNode<K>[]): RuleNode<K>;
  any(...of: readonly RuleNode<K>[]): RuleNode<K>;
  when(cond: RuleNode<K>, then: RuleNode<K>, otherwise: RuleNode<K>): RuleNode<K>;
  has(item: K['holding'], count?: number): RuleNode<K>;
  hasAny(items: readonly K['holding'][]): RuleNode<K>;
  hasDistinct(items: readonly K['holding'][], atLeast: RuleCount<K>): RuleNode<K>;
  countGroup(items: readonly K['holding'][], atLeast: RuleCount<K>): RuleNode<K>;
  helper(name: K['helper'], ...args: readonly RuleArg<K>[]): RuleNode<K>;
  option(key: K['option'], equals: RuleOptionValue): RuleNode<K>;
  optionRef(key: K['option']): OptionRef<K>;
  optionSwitch(
    key: K['option'], cases: readonly (readonly [RuleOptionValue, RuleNode<K>])[], fallback: RuleNode<K>,
  ): RuleNode<K>;
  region(id: K['region']): RuleNode<K>;
  seedIs(key: string, equals: RuleOptionValue): RuleNode<K>;
  allOf(...rules: readonly Rule<K>[]): Rule<K>;
  anyOf(...rules: readonly Rule<K>[]): Rule<K>;
  either(condition: Rule<K>, whenTrue: Rule<K>, whenFalse: Rule<K>): Rule<K>;
  hasItem(item: K['holding'], count?: number): Rule<K>;
  hasAnyItem(items: readonly K['holding'][]): Rule<K>;
  canCollect(location: K['location']): Rule<K>;
  canReach(id: K['region']): Rule<K>;
  exitRule(name: string): Rule<K>;
  helperRule(helpers: KitHelperRegistry<K>, name: K['helper'], ...args: readonly RuleArg<K>[]): Rule<K>;
  placedAt(location: K['location'], item: K['item']): Rule<K>;
  placedIn(item: K['item'], locations: readonly K['location'][]): Rule<K>;
  compileRule(node: RuleNode<K>, helpers: KitHelperRegistry<K>): Rule<K>;
  createCollectionState(world: World<K>): CollectionState<World<K>>;
  computeReachableRegions(state: CollectionState<World<K>>, world: World<K>): Set<K['region']>;
  canCollectLocation(state: CollectionState<World<K>>, key: K['location']): boolean;
  canReachEvent(state: CollectionState<World<K>>, key: K['event']): boolean;
  reachableEvents(state: CollectionState<World<K>>): K['event'][];
  collectReachableEvents(state: CollectionState<World<K>>): void;
  readonly always: Rule<K>;
  readonly never: Rule<K>;
  readonly mainFill: FillPhase<FillBuild<World<K>>>;
}

export type { WorldKit };
