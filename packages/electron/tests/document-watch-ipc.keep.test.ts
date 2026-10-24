/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';
import { createFakeWatcher, pause } from './watch-fixture';
import type { FakeWatch } from './watch-fixture';

type Listener = (details: { isMainFrame: boolean; isSameDocument: boolean }) => void;

interface FakeSender {
  send: ReturnType<typeof vi.fn>;
  destroyed: boolean;
  isDestroyed: () => boolean;
  on: (name: string, fn: Listener) => void;
  fire: (name: string, details?: { isMainFrame: boolean; isSameDocument: boolean }) => void;
}

const sender = (): FakeSender => {
  const listeners = new Map<string, Listener[]>();
  const fake: FakeSender = {
    send: vi.fn(),
    destroyed: false,
    isDestroyed: () => fake.destroyed,
    on: (name, fn) => {
      listeners.set(name, [...(listeners.get(name) ?? []), fn]);
    },
    fire: (name, details = { isMainFrame: true, isSameDocument: false }) => {
      for (const fn of listeners.get(name) ?? []) fn(details);
    },
  };
  return fake;
};

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;
let fakes: FakeWatch[] = [];
let page: FakeSender;
let call: Call;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-watch-ipc-'));
  const fake = createFakeWatcher();
  fakes = fake.fakes;
  access = testAccess({ watcher: fake.watcher, watchMs: 10 });
  access.allowFolder(granted);
  page = sender();
  call = sessionOf({ documents: access }, page);
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('the folder watch over the document channels', () => {
  it('sends the events of a watch to the page that asked, with its id, until it is stopped', async () => {
    await call('document:watch', 'w1', granted, { recursive: true });
    fakes[0]?.signal('change', join('sub', 'in.txt'));
    await vi.waitFor(() => expect(page.send).toHaveBeenCalledWith('document:watchEvent', 'w1', { kind: 'change', path: join(granted, 'sub', 'in.txt') }));
    await call('document:unwatch', 'w1');
    await call('document:unwatch', 'w1');
    await call('document:unwatch', 'unknown');
    expect(fakes[0]?.closed).toBe(1);
  });

  it('refuses a bad or duplicate id, and a folder outside, without keeping the id', async () => {
    for (const id of ['', 'x'.repeat(65), 7]) await expect(call('document:watch', id, granted, {})).rejects.toThrow(/id/);
    await expect(call('document:watch', 'w1', outside, {})).rejects.toThrow(/granted folder/);
    await call('document:watch', 'w1', granted, {});
    await expect(call('document:watch', 'w1', granted, {})).rejects.toThrow(/already exists/);
    expect(fakes).toHaveLength(1);
  });

  it('keys watches by page: another page has its own ids and cannot stop them', async () => {
    const other = sender();
    const otherCall = sessionOf({ documents: access }, other);
    await call('document:watch', 'w1', granted, {});
    await otherCall('document:watch', 'w1', granted, {});
    await otherCall('document:unwatch', 'w1');
    expect(fakes.map((fake) => fake.closed)).toEqual([0, 1]);
    fakes[0]?.signal('change', join('sub', 'in.txt'));
    await vi.waitFor(() => expect(page.send).toHaveBeenCalled());
    expect(other.send).not.toHaveBeenCalled();
  });

});

describe('the end of the watches of a page', () => {
  it('stops that page watches on a main-frame navigation, a gone render process and a destroyed page', async () => {
    for (const name of ['did-start-navigation', 'render-process-gone', 'destroyed']) {
      await call('document:watch', `w-${name}`, granted, {});
      await call('document:watch', `x-${name}`, join(granted, 'sub'), {});
      const before = fakes.length;
      page.fire(name);
      expect(fakes.slice(before - 2).map((fake) => fake.closed), name).toEqual([1, 1]);
    }
  });

  it('keeps its watches on a sub-frame or same-document navigation', async () => {
    await call('document:watch', 'w1', granted, {});
    page.fire('did-start-navigation', { isMainFrame: false, isSameDocument: false });
    page.fire('did-start-navigation', { isMainFrame: true, isSameDocument: true });
    expect(fakes[0]?.closed).toBe(0);
    await call('document:watch', 'w2', granted, {});
    page.fire('did-start-navigation');
    expect(fakes.map((fake) => fake.closed)).toEqual([1, 1]);
    await call('document:watch', 'w1', granted, {});
    expect(fakes).toHaveLength(3);
  });

  it('does not send to a destroyed page', async () => {
    await call('document:watch', 'w1', granted, {});
    fakes[0]?.signal('rename', 'x');
    page.destroyed = true;
    await pause(40);
    expect(page.send).not.toHaveBeenCalled();
  });

  it('stops when the grant is revoked, from main or from the renderer', async () => {
    await call('document:watch', 'w1', granted, {});
    await call('document:revokeFolder', granted);
    expect(fakes[0]?.closed).toBe(1);
    const other = join(base, 'other');
    await mkdir(other);
    access.allowFolder(other);
    await call('document:watch', 'w2', other, {});
    access.revokeFolder(other);
    expect(fakes[1]?.closed).toBe(1);
    fakes[1]?.signal('rename', 'x');
    await pause(40);
    expect(page.send).not.toHaveBeenCalled();
  });
});
