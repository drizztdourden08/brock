/* @layer core @kind test */
import { createWorldFromDef } from '../src/world/define/create-world-from-def';
import { toyWorldDef } from './toy-world.fixture';
import type { ApExportSource } from '../src/archipelago/export';
import type { HelperDefinition, HelperRegistry, RuleNode, World } from '../src/world';

const toyHelpers: readonly HelperDefinition<World>[] = [
  { name: 'keyReady', params: [], body: (state) => state.has('key'), expand: () => ({ op: 'has', item: 'key' }) },
  {
    name: 'needs',
    params: ['n'],
    body: (state) => state.has('key'),
    expand: (_world, count) => ({ op: 'has', item: 'key', count: Number(count) }),
  },
];

const toyRegistry: HelperRegistry<World> = new Map(toyHelpers.map((helper) => [helper.name, helper]));

const needs = (count: number): RuleNode => ({ op: 'helper', name: 'needs', args: [count] });

const toyExportWorld = (): World => {
  const def = toyWorldDef();
  return createWorldFromDef({
    ...def,
    helpers: toyHelpers,
    regions: def.regions.map((region) =>
      region.id === 'lake' ? { ...region, events: [{ key: 'win', region: 'lake' }] } : region),
    locationRules: new Map<string, RuleNode>([['l1', { op: 'all', of: [needs(2), needs(1)] }]]),
    eventRules: new Map<string, RuleNode>([['win', { op: 'has', item: 'lamp' }]]),
  }, { seed: 'export' });
};

const toySource = (overrides: Partial<ApExportSource> = {}): ApExportSource => ({
  game: 'Toy',
  worldVersion: '0.1.0',
  goalEvent: 'win',
  world: toyExportWorld,
  helpers: toyRegistry,
  primitives: [{ name: 'canSwim', params: ['depth'] }],
  locationIds: { t1: 1, t2: 2, f1: 3, l1: 4, l2: 5 },
  locationNames: { 1: 'Town One', 2: 'Town Two', 3: 'Forest One', 4: 'Lake One', 5: 'Lake Two' },
  itemIds: { key: 100, boat: 101, lamp: 102, rock: 103, pebble: 104 },
  itemNames: { 100: 'Key', 101: 'Boat', 102: 'Lamp', 103: 'Rock', 104: 'Pebble' },
  itemClass: (key) => (['key', 'boat', 'lamp'].includes(key) ? 'progression' : 'filler'),
  isPrize: (location) => location.key === 'l2',
  requires: (location) => (location.key === 'f1' ? { present: 'shop' } : { always: true }),
  eventName: (key) => `Event ${key}`,
  options: [
    { key: 'easy', kind: 'toggle', displayName: 'Easy', description: 'Open the lake.', baseline: false, locked: false },
  ],
  ...overrides,
});

export { needs, toyHelpers, toyRegistry, toySource, toyExportWorld };
