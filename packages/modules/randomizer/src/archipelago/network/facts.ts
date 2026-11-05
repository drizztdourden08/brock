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
  hintPoints: null,
  sentChecks: new Set(),
  scoutOwners: new Map(),
  reconnectAttempt: 0,
  nextRetryAt: null,
  retryInFlight: false,
});

export { createNetworkFacts };
