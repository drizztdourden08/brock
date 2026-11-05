/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientUuid } from '../src/archipelago';
import { clientStatusKey } from '../src/archipelago/network/client-status-key';
import { createRig } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';
import {
  SERVER_VERSION, bootRoom, pairRoom, playerAt, presencePacket, trackerConnect, trackerSocket, trackingConnection,
} from './archipelago-room.fixture';

afterEach(() => {
  vi.useRealTimers();
});

const ownKey = clientStatusKey(0, 1);
const otherKey = clientStatusKey(0, 2);

const rowsOf = (rig: Rig) =>
  rig.client.status().players.map(({ name, status, online }) => [name, status, online]);

describe('archipelago presence', { tags: ['critical'] }, () => {
  it('reads every slot client status at connect, then follows its SetReply', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    const keys = [ownKey, otherKey];
    expect(rig.sent('Get')).toEqual([{ cmd: 'Get', keys }]);
    expect(rig.sent('SetNotify')).toEqual([{ cmd: 'SetNotify', keys }]);
    rig.sockets.last().receive([{ cmd: 'Retrieved', keys: { [ownKey]: 5, [otherKey]: 20 } }]);
    expect(rowsOf(rig)).toEqual([['Me', 'connected', true], ['Zelda', 'playing', true]]);
    rig.sockets.last().receive([{ cmd: 'SetReply', key: otherKey, value: 30 }]);
    expect(playerAt(rig, 2).status).toBe('goal');
  });

  it('never sends a Say and reads online as null until a Join says otherwise', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    expect(rig.sent('Say')).toEqual([]);
    expect(playerAt(rig, 2).online).toBeNull();
    rig.sockets.last().receive([presencePacket('Join')]);
    expect(playerAt(rig, 2).online).toBe(true);
    rig.sockets.last().receive([presencePacket('Part')]);
    expect(playerAt(rig, 2).online).toBe(false);
  });

  it('ignores the Join and Part of a tracker link', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([presencePacket('Join')]);
    const stopped = { ...presencePacket('Part'), data: [{ text: 'Zelda (Team #1) has stopped tracking the game.' }] };
    rig.sockets.last().receive([presencePacket('Part', ['Tracker', 'NoText']), stopped]);
    expect(playerAt(rig, 2).online).toBe(true);
  });
});

describe('archipelago tracker links', { tags: ['critical'] }, () => {
  it('opens a tracker link for the other player right after Connected', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    expect(rig.sent('Say')).toEqual([]);
    expect(rig.sockets.sockets).toHaveLength(2);
    expect(trackerSocket(rig).url).toBe('ws://localhost:38281');
    trackerSocket(rig).open();
    trackerSocket(rig).receive([pairRoom.info]);
    expect(trackerConnect(rig)).toEqual([
      expect.objectContaining({
        cmd: 'Connect', game: '', name: 'Zelda', password: 'pw', uuid: `${clientUuid()}-tracker-2`,
        version: SERVER_VERSION, items_handling: 0, slot_data: false, tags: ['Tracker', 'NoText'],
      }),
    ]);
  });

  it('opens no link when tracking other players is off', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    vi.advanceTimersByTime(10000);
    expect(rig.sockets.sockets).toHaveLength(1);
  });
});

describe('archipelago tracker links across a reconnect', { tags: ['critical'] }, () => {
  it('closes the links on a drop and reopens them after the reconnect', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    rig.sockets.last().receive([presencePacket('Join')]);
    expect(playerAt(rig, 2).online).toBe(true);
    rig.sockets.sockets[0]?.drop();
    expect(trackerSocket(rig).closed).toBe(true);
    expect(playerAt(rig, 2).online).toBeNull();
    vi.advanceTimersByTime(1000);
    rig.sockets.last().open();
    for (const packet of [pairRoom.info, pairRoom.data, pairRoom.connected]) rig.sockets.last().receive([packet]);
    expect(rig.sent('Say')).toEqual([]);
    expect(rig.sockets.sockets).toHaveLength(4);
    expect(rig.sockets.last().closed).toBe(false);
  });

  it('shows the checked and total locations of a linked player', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    expect(playerAt(rig, 2)).toMatchObject({ checked: null, total: null });
    trackerSocket(rig).open();
    trackerSocket(rig).receive([pairRoom.info]);
    trackerSocket(rig).receive([{ cmd: 'Connected', checked_locations: [900], missing_locations: [901, 902] }]);
    expect(playerAt(rig, 2)).toMatchObject({ checked: 1, total: 3 });
  });

  it('closes the tracker links when the client closes', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    expect(trackerSocket(rig).closed).toBe(false);
    rig.client.close();
    expect(trackerSocket(rig).closed).toBe(true);
  });
});
