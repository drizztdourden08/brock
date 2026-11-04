/* @layer core @kind logic */
import type { OnlineRoom } from './room.type';

const createOnlineRoom = (): OnlineRoom => ({
  roomInfo: null,
  roomHash: '',
  connected: false,
  heldReceived: [],
  syncPending: false,
  resyncWait: null,
  gameData: null,
  itemNameById: new Map(),
  team: null,
  slot: null,
  players: [],
  reading: null,
  checked: new Set(),
  missing: new Set(),
  reportedLocal: new Set(),
  serverGrants: new Set(),
  scoutIds: [],
  scouted: false,
});

export { createOnlineRoom };
