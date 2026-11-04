/* @layer core @kind test */
import type { Exit, GameWorldDef, Region } from '../src/world';

const place = (id: string, name: string, locations: string[], links: readonly Exit[]): Region => ({
  id,
  name,
  locations: locations.map((key) => ({ key, region: id })),
  events: [],
  exits: links.filter((link) => link.source === id),
  entrances: links.filter((link) => link.target === id),
});

const toyLinks = (): Exit[] => [
  { name: 'to-forest', source: 'town', target: 'forest' },
  { name: 'to-lake', source: 'forest', target: 'lake' },
];

const toyWorldDef = (overrides: Partial<GameWorldDef> = {}): GameWorldDef => ({
  game: 'toy',
  worldSchema: 'toy-world-v1',
  placementSchemas: { current: 'toy-placement-v1' },
  optionSchemas: { current: 'toy-options-v1' },
  start: 'town',
  regions: [
    place('town', 'Town', ['t1', 't2'], toyLinks()),
    place('forest', 'Forest', ['f1'], toyLinks()),
    place('lake', 'Lake', ['l1', 'l2'], toyLinks()),
  ],
  exitRules: new Map([
    ['to-forest', { op: 'helper', name: 'keyReady' }],
    ['to-lake', {
      op: 'any',
      of: [{ op: 'has', item: 'boat' }, { op: 'option', key: 'easy', equals: true }],
    }],
  ]),
  helpers: [{ name: 'keyReady', params: [], body: (state) => state.has('key') }],
  options: () => ({ easy: false }),
  goal: (state) => state.has('lamp'),
  buildPool: () => ({ progression: ['key', 'boat', 'lamp'], rest: ['rock', 'pebble'] }),
  ...overrides,
});

export { toyWorldDef };
