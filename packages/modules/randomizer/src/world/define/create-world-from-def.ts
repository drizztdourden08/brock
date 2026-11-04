/* @layer core @kind logic */
import { compileRuleMap } from './compile-rule-map';
import type { HelperRegistry, ItemRule, Region, RuleOptionValue, World, WorldKeys } from '../types';
import type { GameWorldDef } from './game-world-def.type';

const ALLOW_ANY_ITEM: ItemRule = () => true;

const createWorldFromDef = <K extends WorldKeys>(
  def: GameWorldDef<K>, request: { seed: string },
): World<K> => {
  const helpers: HelperRegistry<World<K>> = new Map((def.helpers ?? []).map((helper) => [helper.name, helper]));
  const regions = new Map<K['region'], Region<K>>(def.regions.map((region) => [region.id, region]));
  const locations = def.regions.flatMap((region) => region.locations);
  const events = def.regions.flatMap((region) => region.events);
  const rules = compileRuleMap(def.exitRules, helpers);
  const locationRules = compileRuleMap(def.locationRules, helpers);
  const eventRules = compileRuleMap(def.eventRules, helpers);
  const itemRules = new Map(def.itemRules ?? []);
  const options = def.options?.(request) ?? {};
  return {
    start: def.start,
    sweepsEvents: def.sweepsEvents ?? false,
    regions,
    locationsByKey: new Map(locations.map((location) => [location.key, location])),
    eventsByKey: new Map(events.map((event) => [event.key, event])),
    rules,
    locationRules,
    eventRules,
    itemRules,
    alwaysAllow: new Map(),
    placedItems: new Map(),
    seedValues: new Map(),
    ...(def.collection ? { collection: def.collection } : {}),
    readOption: (key: K['option']): RuleOptionValue => options[key] ?? false,
    getRule: (name) => rules.get(name),
    getLocationRule: (key) => locationRules.get(key),
    getEventRule: (key) => eventRules.get(key),
    getItemRule: (key) => itemRules.get(key) ?? ALLOW_ANY_ITEM,
    isBeaten: def.goal,
  };
};

export { createWorldFromDef };
