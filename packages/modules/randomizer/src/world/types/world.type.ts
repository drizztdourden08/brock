/* @layer core @kind types */
import type { AlwaysAllowRule } from './always-allow-rule.type';
import type { CollectionHooks } from './collection-hooks.type';
import type { CollectionState } from './collection-state.type';
import type { ItemRule } from './item-rule.type';
import type { Region } from './region.type';
import type { Rule } from './rule.type';
import type { RuleOptionValue } from './rule-option-value.type';
import type { SeedValue } from './seed-value.type';
import type { WorldEvent } from './world-event.type';
import type { WorldKeys } from './world-keys.type';
import type { WorldLocation } from './world-location.type';

interface World<K extends WorldKeys = WorldKeys> {
  readonly keysOf?: K;
  start: K['region'];
  sweepsEvents: boolean;
  regions: ReadonlyMap<K['region'], Region<K>>;
  locationsByKey: ReadonlyMap<K['location'], WorldLocation<K>>;
  eventsByKey: ReadonlyMap<K['event'], WorldEvent<K>>;
  rules: Map<string, Rule<K>>;
  locationRules: Map<K['location'], Rule<K>>;
  eventRules: Map<K['event'], Rule<K>>;
  itemRules: Map<K['location'], ItemRule<K>>;
  alwaysAllow: Map<K['location'], AlwaysAllowRule<K>>;
  placedItems: Map<K['location'], K['item']>;
  seedValues: Map<string, SeedValue>;
  collection?: CollectionHooks<World<K>>;
  readOption(key: K['option']): RuleOptionValue;
  getRule(name: string): Rule<K> | undefined;
  getLocationRule(key: K['location']): Rule<K> | undefined;
  getEventRule(key: K['event']): Rule<K> | undefined;
  getItemRule(key: K['location']): ItemRule<K>;
  isBeaten(state: CollectionState<World<K>>): boolean;
}

export type { World };
