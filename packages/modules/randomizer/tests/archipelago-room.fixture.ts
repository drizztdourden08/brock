/* @layer core @kind test */
import { vi } from 'vitest';
import type { NetworkPlayer, OnlineConnection } from '../src/archipelago';
import type { FakeSocket } from './fake-socket.fixture';
import { GAME, SLOT_NAME, connectedPacket, dataPackage, gameData, roomInfo } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';

const OTHER_GAME = 'Other';
const OTHER_NAME = 'Zelda';
const OTHER_SLOT = 2;
const SERVER_VERSION = { major: 0, minor: 6, build: 3, class: 'Version' };
const otherGameData = {
  item_name_to_id: { 'Other Sword': 500 },
  location_name_to_id: { 'Other Place': 900 },
  checksum: 'xyz',
};

interface RoomPackets {
  info: Record<string, unknown>;
  data: Record<string, unknown>;
  connected: Record<string, unknown>;
}

const soloRoom: RoomPackets = { info: roomInfo, data: dataPackage, connected: connectedPacket };

const pairRoom: RoomPackets = {
  info: {
    ...roomInfo,
    games: [GAME, OTHER_GAME],
    version: SERVER_VERSION,
    tags: ['AP'],
    password: true,
    datapackage_checksums: { [GAME]: 'abc', [OTHER_GAME]: 'xyz' },
  },
  data: { cmd: 'DataPackage', data: { games: { [GAME]: gameData, [OTHER_GAME]: otherGameData } } },
  connected: {
    ...connectedPacket,
    slot_data: { worldVersion: '0.1.0' },
    players: [
      { team: 0, slot: 1, alias: SLOT_NAME, name: SLOT_NAME },
      { team: 0, slot: OTHER_SLOT, alias: OTHER_NAME, name: OTHER_NAME },
    ],
    slot_info: {
      1: { name: SLOT_NAME, game: GAME, type: 1, group_members: [] },
      2: { name: OTHER_NAME, game: OTHER_GAME, type: 1, group_members: [] },
    },
  },
};

const bootRoom = (rig: Rig, room: RoomPackets, connection: OnlineConnection = rig.connection): void => {
  rig.client.connect(connection);
  rig.sockets.last().open();
  for (const packet of [room.info, room.data, room.connected]) rig.sockets.last().receive([packet]);
};

const reopen = (rig: Rig, connected: Record<string, unknown> = connectedPacket): void => {
  rig.sockets.last().drop();
  vi.advanceTimersByTime(1000);
  rig.sockets.last().open();
  rig.sockets.last().receive([roomInfo]);
  rig.sockets.last().receive([connected]);
};

const playerAt = (rig: Rig, slot: number): NetworkPlayer => {
  const player = rig.client.status().players.find((entry) => entry.slot === slot);
  if (player === undefined) throw new Error(`no player in slot ${slot}`);
  return player;
};

const presencePacket = (type: 'Join' | 'Part', tags: string[] = []): Record<string, unknown> => ({
  cmd: 'PrintJSON', type, team: 0, slot: OTHER_SLOT, tags, data: [{ text: `${OTHER_NAME} ${type}` }],
});

const trackingConnection = (rig: Rig): OnlineConnection => ({
  ...rig.connection, trackOtherPlayers: true, password: 'pw',
});

const trackerSocket = (rig: Rig): FakeSocket => {
  const socket = rig.sockets.sockets[1];
  if (socket === undefined) throw new Error('no tracker socket was opened');
  return socket;
};

const trackerConnect = (rig: Rig): unknown => {
  const [text] = trackerSocket(rig).sent;
  return text === undefined ? null : JSON.parse(text);
};

export {
  OTHER_GAME, OTHER_NAME, OTHER_SLOT, SERVER_VERSION,
  bootRoom, pairRoom, playerAt, presencePacket, reopen, soloRoom,
  trackerConnect, trackerSocket, trackingConnection,
};
