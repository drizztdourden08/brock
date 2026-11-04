/* @layer core @kind test */
import type { GameWorldDef, Region } from '../src/world';

const place = (id: string, name: string, locations: string[]): Region => ({
  id,
  name,
  locations: locations.map((key) => ({ key, region: id })),
  events: [],
  exits: [],
  entrances: [],
});

const toyWorldDef = (overrides: Partial<GameWorldDef> = {}): GameWorldDef => ({
  game: 'toy',
  worldSchema: 'toy-world-v1',
  placementSchemas: { current: 'toy-placement-v1' },
  optionSchemas: { current: 'toy-options-v1' },
  start: 'town',
  regions: [
    place('town', 'Town', ['t1', 't2']),
    place('forest', 'Forest', ['f1']),
    place('lake', 'Lake', ['l1', 'l2']),
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
