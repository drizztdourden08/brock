/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientUuid } from '../src/archipelago';
import type { ClientEvent, OnlineConnection } from '../src/archipelago';
import { GAME, SEED, SLOT_NAME, createRig, dataPackage, openRoom, roomInfo } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';
import { SERVER_VERSION, bootRoom, pairRoom } from './archipelago-room.fixture';

afterEach(() => {
  vi.useRealTimers();
});

const handshake = (rig: Rig, connection: OnlineConnection): void => {
  rig.client.connect(connection);
  rig.sockets.last().open();
  rig.sockets.last().receive([{ ...roomInfo, version: SERVER_VERSION }]);
  rig.sockets.last().receive([dataPackage]);
};

const received = (location: number) => ({ item: 10, location, player: 2, flags: 0 });

describe('archipelago connect packet', { tags: ['critical'] }, () => {
  it('carries the password, the client uuid, the server version and the DeathLink tag', () => {
    const rig = createRig({ deathLink: true });
    handshake(rig, { ...rig.connection, password: 'pw', deathLink: true });
    expect(rig.sent('Connect')).toEqual([
      expect.objectContaining({
        cmd: 'Connect', game: GAME, name: SLOT_NAME, password: 'pw', uuid: clientUuid(),
        version: SERVER_VERSION, items_handling: 0b111, tags: ['DeathLink'], slot_data: true,
      }),
    ]);
  });

  it('sends no password and no tags when neither is set', () => {
    const rig = createRig();
    handshake(rig, rig.connection);
    expect(rig.sent('Connect')).toEqual([expect.objectContaining({ password: null, tags: [] })]);
  });
});

describe('archipelago server addresses', { tags: ['critical'] }, () => {
  it('dials a local server over plain ws only', () => {
    const rig = createRig();
    rig.client.connect({ ...rig.connection, url: 'localhost:38281' });
    expect(rig.sockets.sockets.map((fake) => fake.url)).toEqual(['ws://localhost:38281']);
  });

  it('dials an online server over wss first and keeps it when it opens', () => {
    const rig = createRig();
    rig.client.connect({ ...rig.connection, url: 'archipelago.gg:38281' });
    rig.sockets.last().open();
    expect(rig.sockets.sockets.map((fake) => fake.url)).toEqual(['wss://archipelago.gg:38281']);
  });

  it('falls back to ws when the wss attempt never opens', () => {
    const rig = createRig();
    rig.client.connect({ ...rig.connection, url: 'play.example.org:38281' });
    rig.sockets.last().drop();
    expect(rig.sockets.sockets.map((fake) => fake.url)).toEqual([
      'wss://play.example.org:38281',
      'ws://play.example.org:38281',
    ]);
    rig.sockets.last().open();
    rig.sockets.last().receive([roomInfo]);
    expect(rig.sent('GetDataPackage')).toHaveLength(1);
  });
});

describe('archipelago connected room', { tags: ['critical'] }, () => {
  it('hands the slot data and the room to the game once connected', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.scout();
    expect(rig.slotData).toEqual([{ worldVersion: '0.1.0' }]);
    expect(rig.placed).toEqual([expect.objectContaining({ seedName: SEED, slot: 1, team: 0 })]);
    expect(rig.client.status().connection).toBe('connected');
  });

  it('refuses a wrong password, leaves nothing running and says why', () => {
    const rig = createRig();
    const events: ClientEvent[] = [];
    rig.client.onEvent((event) => events.push(event));
    openRoom(rig);
    rig.sockets.last().receive([{ cmd: 'ConnectionRefused', errors: ['InvalidPassword'] }]);
    expect(rig.client.status().connection).toBe('refused');
    expect(rig.probe.polling).toBe(false);
    expect(rig.sent('LocationScouts')).toHaveLength(0);
    expect(events).toContainEqual({ type: 'disconnected', reason: '[Online] Wrong room password.' });
  });
});

describe('archipelago resync', { tags: ['critical'] }, () => {
  it('asks for Sync on a gap and resumes from the replayed list', () => {
    const rig = createRig();
    rig.boot();
    rig.scout();
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [received(1), received(2)] }]);
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 3, items: [received(4)] }]);
    expect(rig.sent('Sync')).toHaveLength(1);
    expect(rig.probe.delivered.map((item) => item.location)).toEqual([1, 2]);
    const replay = [received(1), received(2), received(3), received(4)];
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: replay }]);
    expect(rig.probe.delivered.map((item) => item.location)).toEqual([1, 2, 3, 4]);
    expect(rig.queue.saved()).toBe(4);
  });
});
