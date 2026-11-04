/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRig } from './archipelago-client.fixture';

afterEach(() => {
  vi.useRealTimers();
});

const item = (location: number, player = 2) => ({ item: 10, location, player, flags: 0 });

describe('received queue', { tags: ['critical'] }, () => {
  it('hands each index once', () => {
    const { queue } = createRig();
    expect(queue.isNew(0)).toBe(true);
    queue.hand(0);
    expect(queue.isNew(0)).toBe(false);
    expect(queue.next()).toBe(1);
    expect(queue.queued()).toBe(1);
  });

  it('settles on grant and keeps the cursor behind a gap', () => {
    const { queue } = createRig();
    queue.hand(0);
    queue.hand(1);
    expect(queue.settle(1, queue.epoch())).toBe(true);
    expect(queue.saved()).toBe(0);
    expect(queue.settle(0, queue.epoch())).toBe(true);
    expect(queue.saved()).toBe(2);
    expect(queue.queued()).toBe(0);
    expect(queue.isNew(1)).toBe(false);
  });

  it('delivers through the client and skips its own echo', () => {
    const rig = createRig();
    rig.probe.grants = [100];
    rig.boot();
    rig.scout();
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [item(100, 1), item(7)] }]);
    expect(rig.probe.delivered.map((delivered) => delivered.location)).toEqual([7]);
    expect(rig.queue.saved()).toBe(1);
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [item(100, 1), item(7)] }]);
    expect(rig.probe.delivered).toHaveLength(1);
  });

  it('resets on a save swap and asks the server again', () => {
    const rig = createRig();
    rig.boot();
    rig.scout();
    rig.sockets.last().receive([{ cmd: 'ReceivedItems', index: 0, items: [item(7)] }]);
    const before = rig.queue.epoch();
    rig.probe.swap();
    expect(rig.queue.epoch()).toBe(before + 1);
    expect(rig.queue.queued()).toBe(0);
    expect(rig.sent('Sync')).toHaveLength(1);
  });

  it('drops a grant that belongs to an older epoch', () => {
    const { queue } = createRig();
    const stale = queue.epoch();
    queue.hand(0);
    queue.reset();
    expect(queue.settle(0, stale)).toBe(false);
    expect(queue.saved()).toBe(0);
  });
});
