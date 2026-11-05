/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME, SLOT_NAME, connectedPacket, createRig, gameData, openRoom, roomInfo } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';

const reconnect = (rig: Rig): void => {
  rig.sockets.last().drop();
  vi.advanceTimersByTime(1000);
  rig.sockets.last().open();
  rig.sockets.last().receive([roomInfo]);
  rig.sockets.last().receive([connectedPacket]);
};

afterEach(() => {
  vi.useRealTimers();
});

describe('archipelago client handshake', { tags: ['critical'] }, () => {
  it('asks for the data package on a cache miss, then connects', () => {
    const rig = createRig();
    openRoom(rig);
    expect(rig.sent('GetDataPackage')).toEqual([{ cmd: 'GetDataPackage', games: [GAME] }]);
    expect(rig.sent('Connect')).toHaveLength(0);
    rig.sockets.last().receive([{ cmd: 'DataPackage', data: { games: { [GAME]: gameData } } }]);
    const [connect] = rig.sent('Connect');
    expect(connect).toMatchObject({ cmd: 'Connect', game: GAME, name: SLOT_NAME, items_handling: 7, slot_data: true });
    expect(rig.cache.entries.has(`${GAME}:abc`)).toBe(true);
  });

  it('connects without a data package on a cache hit', () => {
    const rig = createRig();
    rig.cache.write(GAME, 'abc', gameData);
    openRoom(rig);
    expect(rig.sent('GetDataPackage')).toHaveLength(0);
    expect(rig.sent('Connect')).toHaveLength(1);
  });

  it('scouts the locations once per room, also across a reconnect', () => {
    const rig = createRig();
    rig.boot();
    expect(rig.sent('LocationScouts')).toEqual([{ cmd: 'LocationScouts', locations: [100, 101], create_as_hint: 0 }]);
    rig.scout();
    reconnect(rig);
    expect(rig.sent('LocationScouts')).toHaveLength(1);
  });

  it('scouts again after a reconnect when the link dropped before the scout reply', () => {
    const rig = createRig();
    rig.boot();
    reconnect(rig);
    expect(rig.sent('LocationScouts')).toHaveLength(2);
  });
});

describe('archipelago client receiving', { tags: ['critical'] }, () => {
  it('sends Sync when the received items skip an index', () => {
    const rig = createRig();
    rig.boot();
    rig.scout();
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 3, items: [{ item: 10, location: 5, player: 2, flags: 0 }] }]);
    expect(rig.sent('Sync')).toHaveLength(1);
    expect(rig.probe.delivered).toHaveLength(0);
  });

  it('holds received items until the locations are scouted', () => {
    const rig = createRig();
    rig.boot();
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [{ item: 10, location: 5, player: 2, flags: 0 }] }]);
    expect(rig.probe.delivered).toHaveLength(0);
    rig.scout();
    expect(rig.probe.delivered).toHaveLength(1);
  });
});

describe('archipelago client reconnect', { tags: ['critical'] }, () => {
  it('backs off 1s, 2s, 4s and starts over after a connection', () => {
    const rig = createRig();
    rig.boot();
    rig.sockets.last().drop();
    vi.advanceTimersByTime(999);
    expect(rig.sockets.sockets).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(rig.sockets.sockets).toHaveLength(2);
    rig.sockets.last().drop();
    vi.advanceTimersByTime(1999);
    expect(rig.sockets.sockets).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(rig.sockets.sockets).toHaveLength(3);
    rig.sockets.last().drop();
    vi.advanceTimersByTime(3999);
    expect(rig.sockets.sockets).toHaveLength(3);
    vi.advanceTimersByTime(1);
    expect(rig.sockets.sockets).toHaveLength(4);
    rig.sockets.last().open();
    rig.sockets.last().receive([roomInfo]);
    rig.sockets.last().receive([connectedPacket]);
    rig.sockets.last().drop();
    vi.advanceTimersByTime(1000);
    expect(rig.sockets.sockets).toHaveLength(5);
  });

  it('stops reconnecting after the server refuses the connection', () => {
    const rig = createRig();
    openRoom(rig);
    rig.sockets.last().receive([{ cmd: 'ConnectionRefused', errors: ['InvalidPassword'] }]);
    vi.advanceTimersByTime(120000);
    expect(rig.sockets.sockets).toHaveLength(1);
    expect(rig.client.status().connection).toBe('refused');
  });
});

describe('archipelago client goal and DeathLink', { tags: ['critical'] }, () => {
  it('sends the goal once', () => {
    const rig = createRig();
    rig.boot();
    rig.client.reportGoal();
    rig.client.reportGoal();
    expect(rig.sent('StatusUpdate')).toEqual([{ cmd: 'StatusUpdate', status: 30 }]);
  });

  it('drops its own DeathLink echo and honours another player', () => {
    const rig = createRig({ deathLink: true });
    rig.boot();
    rig.probe.die('fell');
    const bounce = rig.sent('Bounce').find((packet) => Array.isArray(packet.tags) && packet.tags.includes('DeathLink'));
    expect(bounce).toMatchObject({ tags: ['DeathLink'], data: { source: SLOT_NAME } });
    rig.sockets.last().receive([{ cmd: 'Bounced', tags: ['DeathLink'], data: bounce?.data }]);
    expect(rig.probe.killed).toBe(0);
    vi.advanceTimersByTime(6000);
    rig.sockets.last().receive([{ cmd: 'Bounced', tags: ['DeathLink'], data: { source: 'Other', cause: 'lava' } }]);
    expect(rig.probe.killed).toBe(1);
  });

  it('turns DeathLink off when the slot data says it is off', () => {
    const rig = createRig({ deathLink: true, slotDeathLink: false });
    rig.boot();
    const updates = rig.sent('ConnectUpdate');
    expect(updates).toHaveLength(1);
    expect(updates[0]?.tags).toEqual([]);
  });
});

describe('archipelago refused session', { tags: ['critical'] }, () => {
  it('disarms the game once, and a later close does not disarm again', () => {
    const rig = createRig();
    openRoom(rig);
    rig.sockets.last().receive([{ cmd: 'ConnectionRefused', errors: ['IncompatibleVersion'] }]);
    expect(rig.client.status().connection).toBe('refused');
    expect(rig.probe.disarms).toBe(1);
    rig.client.close();
    expect(rig.probe.disarms).toBe(1);
  });
});
