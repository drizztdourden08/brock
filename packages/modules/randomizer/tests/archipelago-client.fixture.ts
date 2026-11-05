/* @layer core @kind test */
import { vi } from 'vitest';
import { createArchipelagoClient, roomHashOf } from '../src/archipelago';
import type { ArchipelagoSession, DataPackageCache, DeliverResult, OnlineConnection, OnlineHost, ReceivedItem } from '../src/archipelago';
import { createMemoryApStateStore } from '../src/session/received/memory-ap-state-store';
import { createReceivedQueue } from '../src/session/received/received-queue';
import type { ReceivedQueue } from '../src/session/received/received-queue.type';
import { createFakeSocketFactory } from './fake-socket.fixture';
import type { FakeSocketFactory } from './fake-socket.fixture';

const SEED = 'seed-one';
const GAME = 'Test';
const SLOT_NAME = 'Me';

interface HostProbe {
  host: OnlineHost;
  delivered: ReceivedItem[];
  killed: number;
  grants: number[];
  collected: number[];
  polling: boolean;
  nextDelivery: DeliverResult;
  fileInPlay: boolean;
  goal: boolean;
  swap(): void;
  die(cause: string): void;
  ready(): void;
}

const createHostProbe = (): HostProbe => {
  const swaps = new Set<() => void>();
  const deaths = new Set<(cause: string) => void>();
  const readies = new Set<() => void>();
  let cursor: { index: number; roomHash: string } | null = null;
  const probe: HostProbe = {
    delivered: [],
    killed: 0,
    grants: [],
    collected: [],
    polling: false,
    nextDelivery: 'delivered',
    fileInPlay: true,
    goal: false,
    swap: () => swaps.forEach((f) => f()),
    die: (cause) => deaths.forEach((f) => f(cause)),
    ready: () => [...readies].forEach((f) => f()),
    host: {
      arm: () => undefined,
      disarm: () => undefined,
      armScouted: () => probe.grants,
      deliver(item) {
        if (probe.nextDelivery === 'delivered') probe.delivered.push(item);
        return probe.nextDelivery;
      },
      cancelDeliveries: () => undefined,
      onDeliveryReady(f) {
        readies.add(f);
        return () => readies.delete(f);
      },
      isFileInPlay: () => probe.fileInPlay,
      onSaveSwap(f) {
        swaps.add(f);
        return () => swaps.delete(f);
      },
      goalReached: () => probe.goal,
      startPolling() {
        probe.polling = true;
      },
      pausePolling() {
        probe.polling = false;
      },
      readCursor: () => cursor,
      writeCursor: (next) => {
        cursor = next;
      },
      markCollected: (ids) => probe.collected.push(...ids),
      setDeathLink: () => undefined,
      killLink() {
        probe.killed += 1;
        return 'armed';
      },
      onLinkDied(f) {
        deaths.add(f);
        return () => deaths.delete(f);
      },
    },
  };
  return probe;
};

const createMemoryCache = (): DataPackageCache & { entries: Map<string, unknown> } => {
  const entries = new Map<string, unknown>();
  return {
    entries,
    read: (game, checksum) => entries.get(`${game}:${checksum}`) ?? null,
    write: (game, checksum, pkg) => {
      entries.set(`${game}:${checksum}`, pkg);
    },
  };
};

const roomInfo = { cmd: 'RoomInfo', games: [GAME], seed_name: SEED, datapackage_checksums: { [GAME]: 'abc' } };
const gameData = { item_name_to_id: { Boots: 10 }, location_name_to_id: { Chest: 100, Cave: 101 }, checksum: 'abc' };
const dataPackage = { cmd: 'DataPackage', data: { games: { [GAME]: gameData } } };
const connectedPacket = {
  cmd: 'Connected',
  team: 0,
  slot: 1,
  players: [{ team: 0, slot: 1, alias: SLOT_NAME, name: SLOT_NAME }],
  checked_locations: [],
  missing_locations: [100, 101],
  slot_data: {},
  slot_info: { 1: { name: SLOT_NAME, game: GAME, type: 1, group_members: [] } },
};
const locationInfo = {
  cmd: 'LocationInfo',
  locations: [
    { item: 10, location: 100, player: 1, flags: 0 },
    { item: 10, location: 101, player: 1, flags: 0 },
  ],
};

interface Rig {
  sockets: FakeSocketFactory;
  probe: HostProbe;
  queue: ReceivedQueue;
  cache: ReturnType<typeof createMemoryCache>;
  client: ArchipelagoSession;
  logs: string[];
  placed: unknown[];
  slotData: unknown[];
  connection: OnlineConnection;
  boot(): void;
  scout(): void;
  sent(cmd: string): Record<string, unknown>[];
}

const createRig = (options: { deathLink?: boolean } = {}): Rig => {
  vi.useFakeTimers();
  const sockets = createFakeSocketFactory();
  const probe = createHostProbe();
  const cache = createMemoryCache();
  const queue = createReceivedQueue({ store: createMemoryApStateStore(), roomHash: () => roomHashOf(SEED) });
  const logs: string[] = [];
  const placed: unknown[] = [];
  const slotData: unknown[] = [];
  const client = createArchipelagoClient({
    game: GAME,
    host: probe.host,
    received: queue,
    slot(raw) {
      slotData.push(raw);
      return { kind: 'ok', deathLink: options.deathLink === true, placement: (input) => input };
    },
    locationKeyOf: (_id, name) => name,
    placed: (placement) => placed.push(placement),
    createSocket: sockets.createSocket,
    cache,
    log: (line) => logs.push(line),
  });
  const connection: OnlineConnection = {
    url: 'ws://localhost:38281', slotName: SLOT_NAME, deathLink: options.deathLink === true, trackOtherPlayers: false,
  };
  const sent = (cmd: string): Record<string, unknown>[] =>
    (sockets.sentPackets().flat() as Record<string, unknown>[]).filter((packet) => packet.cmd === cmd);
  return {
    sockets, probe, queue, cache, client, logs, placed, slotData, connection, sent,
    boot() {
      client.connect(connection);
      sockets.last().open();
      sockets.last().receive([roomInfo]);
      sockets.last().receive([dataPackage]);
      sockets.last().receive([connectedPacket]);
    },
    scout() {
      sockets.last().receive([locationInfo]);
    },
  };
};

const openRoom = (rig: Rig, info: Record<string, unknown> = roomInfo): void => {
  rig.client.connect(rig.connection);
  rig.sockets.last().open();
  rig.sockets.last().receive([info]);
};

export { GAME, SEED, SLOT_NAME, connectedPacket, createRig, dataPackage, gameData, locationInfo, openRoom, roomInfo };
export type { Rig };
