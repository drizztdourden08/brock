/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPinger } from '../src/archipelago/network/ping';
import { PING_INTERVAL_MS, PING_TAG } from '../src/archipelago/network/ping.constants';
import { GAME, SEED, createRig } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';
import { OTHER_GAME, bootRoom, pairRoom, playerAt, presencePacket, soloRoom } from './archipelago-room.fixture';

const CLOCK_START = 1_000_000;

afterEach(() => {
  vi.useRealTimers();
});

const startedRig = (): Rig => {
  const rig = createRig();
  vi.setSystemTime(CLOCK_START);
  return rig;
};

const pings = (rig: Rig): Record<string, unknown>[] =>
  rig.sent('Bounce').filter((packet) => Array.isArray(packet.tags) && packet.tags.includes(PING_TAG));

const echoLastPing = (rig: Rig): void => {
  const ping = pings(rig).at(-1);
  if (ping === undefined) throw new Error('no ping was sent');
  rig.sockets.last().receive([{ cmd: 'Bounced', tags: ping.tags, slots: ping.slots, data: ping.data }]);
};

const item = { item: 10, location: 5, player: 2, flags: 0 };

describe('archipelago network status', { tags: ['critical'] }, () => {
  it('fills the connection, server and progress facts on connect', () => {
    const rig = startedRig();
    bootRoom(rig, pairRoom);
    expect(rig.client.status()).toMatchObject({
      connection: 'connected',
      health: { lastPacketAt: CLOCK_START },
      server: { version: '0.6.3', seedName: SEED, tags: ['AP'] },
      progress: { checked: 0, total: 2, received: 0, sentToOthers: 0 },
      reconnect: { attempt: 0, nextRetryAt: null, inFlight: false },
    });
  });

  it('follows RoomUpdate checks and received items in the progress', () => {
    const rig = startedRig();
    rig.boot();
    rig.sockets.last().receive([{ cmd: 'RoomUpdate', checked_locations: [100] }]);
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [item] }]);
    expect(rig.client.status().progress).toEqual({ checked: 1, total: 2, received: 1, sentToOthers: 0 });
  });

  it('lists each player of the team with the game they play', () => {
    const rig = startedRig();
    bootRoom(rig, pairRoom);
    expect(rig.client.status().players).toMatchObject([
      { slot: 1, name: 'Me', game: GAME, online: true },
      { slot: 2, name: 'Zelda', game: OTHER_GAME, online: null },
    ]);
  });

  it('reads a player as unknown until a Join or roster reply says otherwise', () => {
    const rig = startedRig();
    bootRoom(rig, pairRoom);
    expect(playerAt(rig, 1).online).toBe(true);
    expect(playerAt(rig, 2).online).toBeNull();
    expect(playerAt(rig, 2).status).toBe('unknown');
  });

  it('marks the other players online on Join and offline on Part', () => {
    const rig = startedRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([presencePacket('Join')]);
    expect(playerAt(rig, 2)).toMatchObject({ online: true });
    rig.sockets.last().receive([presencePacket('Part')]);
    expect(playerAt(rig, 2)).toMatchObject({ online: false });
  });
});

describe('archipelago room progress', { tags: ['critical'] }, () => {
  it('counts the checks sent for items that belong to other players', () => {
    const rig = startedRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([{
      cmd: 'LocationInfo',
      locations: [{ item: 500, location: 100, player: 2, flags: 0 }, { item: 10, location: 101, player: 1, flags: 0 }],
    }]);
    rig.client.reportCheck(100);
    rig.client.reportCheck(101);
    expect(rig.client.status().progress.sentToOthers).toBe(1);
  });

  it('takes hint points from Connected, then from each RoomUpdate', () => {
    const rig = startedRig();
    expect(rig.client.status().server.hintPoints).toBeUndefined();
    bootRoom(rig, { ...pairRoom, connected: { ...pairRoom.connected, hint_points: 3 } });
    expect(rig.client.status().server.hintPoints).toBe(3);
    rig.sockets.last().receive([{ cmd: 'RoomUpdate', hint_points: 7 }]);
    expect(rig.client.status().server.hintPoints).toBe(7);
  });
});

describe('archipelago reconnect status', { tags: ['critical'] }, () => {
  it('reads the reconnect attempt and the next retry time after a drop', () => {
    const rig = startedRig();
    rig.boot();
    rig.sockets.last().drop();
    expect(rig.client.status().reconnect).toEqual({ attempt: 1, nextRetryAt: CLOCK_START + 1000, inFlight: false });
    vi.advanceTimersByTime(1000);
    expect(rig.client.status().reconnect).toEqual({ attempt: 1, nextRetryAt: null, inFlight: true });
    rig.sockets.last().drop();
    expect(rig.client.status().reconnect).toEqual({ attempt: 2, nextRetryAt: Date.now() + 2000, inFlight: false });
    vi.advanceTimersByTime(2000);
    rig.sockets.last().open();
    rig.sockets.last().receive([soloRoom.info, soloRoom.connected]);
    expect(rig.client.status().reconnect).toEqual({ attempt: 0, nextRetryAt: null, inFlight: false });
  });

  it('reads a drop as reconnecting', () => {
    const rig = startedRig();
    rig.boot();
    rig.sockets.last().drop();
    expect(rig.client.status().connection).toBe('reconnecting');
  });

  it('reads a retry in flight as connecting until the room answers', () => {
    const rig = startedRig();
    rig.boot();
    rig.sockets.last().drop();
    vi.advanceTimersByTime(1000);
    expect(rig.client.status().connection).toBe('connecting');
    rig.sockets.last().open();
    rig.sockets.last().receive([soloRoom.info, soloRoom.connected]);
    expect(rig.client.status().connection).toBe('connected');
  });
});

describe('archipelago ping', { tags: ['critical'] }, () => {
  it('sends a ping on connect and reads the round trip from its echo', () => {
    const rig = startedRig();
    rig.boot();
    expect(pings(rig)).toEqual([expect.objectContaining({ slots: [1], data: { t: CLOCK_START, id: 0 } })]);
    vi.advanceTimersByTime(40);
    echoLastPing(rig);
    expect(rig.client.status().health.pingMs).toBe(40);
    vi.advanceTimersByTime(PING_INTERVAL_MS - 40);
    expect(pings(rig)).toHaveLength(2);
    vi.advanceTimersByTime(20);
    echoLastPing(rig);
    expect(rig.client.status().health.pingMs).toBe(20);
  });

  it('reports the ping mean and the sample count in the status', () => {
    const rig = startedRig();
    rig.boot();
    vi.advanceTimersByTime(40);
    echoLastPing(rig);
    vi.advanceTimersByTime(PING_INTERVAL_MS - 40);
    vi.advanceTimersByTime(20);
    echoLastPing(rig);
    expect(rig.client.status().health).toMatchObject({ pingMs: 20, pingMeanMs: 30, pingSamples: 2 });
    rig.sockets.last().drop();
    expect(rig.client.status().health.pingSamples).toBe(0);
    expect(rig.client.status().health.pingMeanMs).toBeUndefined();
  });

  it('keeps the mean of the round trips it has seen', () => {
    vi.useFakeTimers();
    let clock = 0;
    const pinger = createPinger({ send: () => undefined, onSample: () => undefined, now: () => clock });
    pinger.start(1);
    clock = 40;
    pinger.handleBounced({ cmd: 'Bounced', tags: [PING_TAG], data: { id: 0 } });
    clock = PING_INTERVAL_MS;
    vi.advanceTimersByTime(PING_INTERVAL_MS);
    clock = PING_INTERVAL_MS + 20;
    pinger.handleBounced({ cmd: 'Bounced', tags: [PING_TAG], data: { id: 1 } });
    pinger.stop();
    expect([pinger.lastMs, pinger.meanMs, pinger.samples]).toEqual([20, 30, 2]);
  });

  it('leaves a bounce that is not its ping to the other handlers', () => {
    const pinger = createPinger({ send: () => undefined, onSample: () => undefined });
    expect(pinger.handleBounced({ cmd: 'Bounced', tags: ['DeathLink'], data: { id: 0 } })).toBe(false);
  });
});
