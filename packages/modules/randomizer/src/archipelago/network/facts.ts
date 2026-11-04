/* @layer core @kind logic */
import type { NetworkFacts } from './network-facts.type';

const createNetworkFacts = (): NetworkFacts => ({
  connection: 'idle',
  url: null,
  serverVersion: null,
  seedName: null,
  tags: [],
  lastPacketAt: null,
  team: null,
  slot: null,
  players: [],
  games: new Map(),
  checked: new Set(),
  missing: new Set(),
  itemsReceived: 0,
});

export { createNetworkFacts };
