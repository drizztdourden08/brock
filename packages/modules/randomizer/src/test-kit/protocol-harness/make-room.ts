/* @layer core @kind logic */
import type { FakeRoom } from '../fake-server';
import { OWN } from './protocol-harness.constants';

const makeRoom = (overrides: Partial<FakeRoom> = {}, game: string = OWN): FakeRoom => ({
  games: {
    [game]: {
      item_name_to_id: { Bow: 100, Hookshot: 101, Lamp: 102, Boots: 103 },
      location_name_to_id: { 'check-001': 1, 'check-002': 2, 'check-003': 3 },
      checksum: 'own-1',
    },
    Other: { item_name_to_id: { 'Other Sword': 500 }, location_name_to_id: { 'Other Place': 900 }, checksum: 'other-1' },
  },
  items: [],
  checked: [],
  missing: [1, 2, 3],
  players: [{ team: 0, slot: 1, alias: 'Link', name: 'Link' }, { team: 0, slot: 2, alias: 'Zelda', name: 'Zelda' }],
  slotInfo: {
    1: { name: 'Link', game, type: 1, group_members: [] },
    2: { name: 'Zelda', game: 'Other', type: 1, group_members: [] },
  },
  slotData: { deathLink: false },
  placements: {
    1: { item: 101, location: 1, player: 1, flags: 0 },
    2: { item: 500, location: 2, player: 2, flags: 0 },
    3: { item: 102, location: 3, player: 1, flags: 0 },
  },
  refusedUrls: new Set(),
  ...overrides,
});

export { makeRoom };
