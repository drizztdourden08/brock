/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { connectedPacket, createRig } from './archipelago-client.fixture';
import { bootRoom, pairRoom, reopen, soloRoom } from './archipelago-room.fixture';

afterEach(() => {
  vi.useRealTimers();
});

const itemSend = (item: number, itemOwner: number, location: number, finder: number) => ({
  cmd: 'PrintJSON',
  type: 'ItemSend',
  data: [
    { type: 'player_id', text: String(finder) },
    { text: ' sent ' },
    { type: 'item_id', text: String(item), player: itemOwner },
    { text: ' to ' },
    { type: 'player_id', text: '1' },
    { text: ' (' },
    { type: 'location_id', text: String(location), player: finder },
    { text: ')' },
  ],
});

const roomWithChecked = (checked: number[], missing: number[]) => ({
  ...soloRoom,
  connected: { ...connectedPacket, checked_locations: checked, missing_locations: missing },
});

describe('archipelago offline checks', { tags: ['critical'] }, () => {
  it('reports the checks the server lacks when the connection comes back', () => {
    const rig = createRig();
    rig.boot();
    rig.sockets.last().drop();
    rig.client.reportCheck(100);
    rig.client.reportCheck(101);
    expect(rig.sent('LocationChecks')).toHaveLength(0);
    reopen(rig, { ...connectedPacket, checked_locations: [100], missing_locations: [101] });
    expect(rig.sent('LocationChecks')).toEqual([{ cmd: 'LocationChecks', locations: [101] }]);
  });

  it('sends a live check once and never one the room already has', () => {
    const rig = createRig();
    bootRoom(rig, roomWithChecked([100], [101]));
    rig.client.reportCheck(100);
    rig.client.reportCheck(101);
    rig.client.reportCheck(101);
    expect(rig.sent('LocationChecks')).toEqual([{ cmd: 'LocationChecks', locations: [101] }]);
  });
});

describe('archipelago room messages', { tags: ['critical'] }, () => {
  it('renders PrintJSON with player, item and location names from every game', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([itemSend(10, 1, 900, 2), itemSend(500, 2, 100, 1)]);
    expect(rig.client.messages().map(({ kind, text }) => ({ kind, text }))).toEqual([
      { kind: 'item', text: 'Zelda sent Boots to Me (Other Place)' },
      { kind: 'item', text: 'Me sent Other Sword to Me (Chest)' },
    ]);
  });

  it('names an id the data package does not know by its number', () => {
    const rig = createRig();
    bootRoom(rig, pairRoom);
    rig.sockets.last().receive([itemSend(77, 1, 78, 2)]);
    expect(rig.client.messages().map(({ text }) => text)).toEqual(['Zelda sent Item 77 to Me (Location 78)']);
  });
});

describe('archipelago room checked locations', { tags: ['critical'] }, () => {
  it('marks the locations the room already has as done, once each', () => {
    const rig = createRig();
    bootRoom(rig, roomWithChecked([100], [101]));
    expect(rig.probe.collected).toEqual([100]);
    rig.sockets.last().receive([{ cmd: 'RoomUpdate', checked_locations: [100, 101] }]);
    expect(rig.probe.collected).toEqual([100, 101]);
    expect(rig.client.checkedLocations()).toEqual(new Set([100, 101]));
  });
});
