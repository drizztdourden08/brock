/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clientUuid } from '../src/archipelago';
import { clientStatusKey } from '../src/archipelago/network/client-status-key';
import { SETTLE_AFTER_MS } from '../src/archipelago/network/roster.constants';
import { createRig } from './archipelago-client.fixture';
import type { Rig } from './archipelago-client.fixture';
import {
  BOTH_ONLINE, OTHER_OFFLINE, SERVER_VERSION, bootRoom, commandResult, pairRoom, playerAt, presencePacket,
  trackerConnect, trackerSocket, trackingConnection,
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

  it('lets the players reply decide who is online and keeps it out of the log', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    expect(rig.sent('Say')).toEqual([{ cmd: 'Say', text: '!players' }]);
    rig.sockets.last().receive([{ cmd: 'Retrieved', keys: { [otherKey]: 5 } }]);
    expect(playerAt(rig, 2).online).toBe(true);
    rig.sockets.last().receive([commandResult(OTHER_OFFLINE)]);
    expect(rowsOf(rig)[1]).toEqual(['Zelda', 'unknown', false]);
    expect(rig.client.messages().map(({ text }) => text)).not.toContain(OTHER_OFFLINE);
  });

  it('ignores the Join and Part of a tracker link', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    const stopped = { ...presencePacket('Part'), data: [{ text: 'Zelda (Team #1) has stopped tracking the game.' }] };
    rig.sockets.last().receive([presencePacket('Join', ['Tracker', 'NoText']), stopped]);
    expect(playerAt(rig, 2).online).toBe(true);
    rig.sockets.last().receive([presencePacket('Part')]);
    expect(playerAt(rig, 2).online).toBe(false);
  });
});

describe('archipelago tracker links', { tags: ['critical'] }, () => {
  it('opens a tracker link for the other player once the roster answers', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    expect(rig.sockets.sockets).toHaveLength(1);
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
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

  it('opens the links after the settle time when the server never answers', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    vi.advanceTimersByTime(SETTLE_AFTER_MS - 1);
    expect(rig.sockets.sockets).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(rig.sockets.sockets).toHaveLength(2);
  });

  it('opens no link when tracking other players is off', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    vi.advanceTimersByTime(SETTLE_AFTER_MS);
    expect(rig.sockets.sockets).toHaveLength(1);
  });
});

describe('archipelago tracker links across a reconnect', { tags: ['critical'] }, () => {
  it('closes the links on a drop and reopens them with a new roster query after the reconnect', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    expect(playerAt(rig, 2).online).toBe(true);
    rig.sockets.sockets[0]?.drop();
    expect(trackerSocket(rig).closed).toBe(true);
    expect(playerAt(rig, 2).online).toBeNull();
    vi.advanceTimersByTime(1000);
    rig.sockets.last().open();
    rig.sockets.last().receive([pairRoom.info, pairRoom.connected]);
    expect(rig.sent('Say')).toHaveLength(2);
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    expect(rig.sockets.sockets).toHaveLength(4);
    expect(rig.sockets.last().closed).toBe(false);
  });

  it('shows the checked and total locations of a linked player', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    expect(playerAt(rig, 2)).toMatchObject({ checked: null, total: null });
    trackerSocket(rig).open();
    trackerSocket(rig).receive([pairRoom.info]);
    trackerSocket(rig).receive([{ cmd: 'Connected', checked_locations: [900], missing_locations: [901, 902] }]);
    expect(playerAt(rig, 2)).toMatchObject({ checked: 1, total: 3 });
  });

  it('closes the tracker links when the client closes', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom, trackingConnection(rig));
    rig.sockets.last().receive([commandResult(BOTH_ONLINE)]);
    expect(trackerSocket(rig).closed).toBe(false);
    rig.client.close();
    expect(trackerSocket(rig).closed).toBe(true);
  });
});
