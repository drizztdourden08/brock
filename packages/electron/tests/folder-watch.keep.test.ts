/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, symlink, writeFile } from 'fs/promises';
import { join } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { openWatchWorld, pause, settle, withoutSentinel } from './watch-fixture';
import type { WatchWorld } from './watch-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const IN = join('sub', 'in.txt');

let world: WatchWorld;
let access: DocumentAccess;

const settled = async (): Promise<void> => settle(world.fakes[0], world.granted, world.events);

const seen = (): unknown[] => withoutSentinel(world.granted, world.events);

beforeEach(async () => {
  world = await openWatchWorld('brock-watch-');
  access = world.open();
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('the events of a watch', () => {
  it('reports add for a new path, change for a modified one and remove for a gone one', async () => {
    const { granted, fakes, listener } = world;
    await access.watch(granted, {}, listener);
    await writeFile(join(granted, 'new.txt'), 'n');
    fakes[0]?.signal('rename', 'new.txt');
    fakes[0]?.signal('change', IN);
    fakes[0]?.signal('rename', 'gone.txt');
    await settled();
    expect(seen()).toEqual([
      { kind: 'add', path: join(granted, 'new.txt') },
      { kind: 'change', path: join(granted, IN) },
      { kind: 'remove', path: join(granted, 'gone.txt') },
    ]);
  });

  it('waits for the debounce and folds repeated signals of one path into one event', async () => {
    const { granted, fakes, listener, events } = world;
    access = world.open({ watchMs: 40 });
    await access.watch(granted, {}, listener);
    for (let count = 0; count < 5; count += 1) fakes[0]?.signal('change', IN);
    expect(events).toEqual([]);
    await settled();
    expect(seen()).toEqual([{ kind: 'change', path: join(granted, IN) }]);
  });

  it('drops events for the app folders and for links that lead outside', async () => {
    const { granted, outside, fakes, listener } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await access.watch(granted, { recursive: true }, listener);
    for (const name of [join('app', 'Data', 'app.json'), join('app', 'Data', 'new.json'), join('out', 'secret.txt'), 'out', null, IN]) {
      fakes[0]?.signal(name === IN ? 'change' : 'rename', name);
    }
    await settled();
    expect(seen()).toEqual([{ kind: 'change', path: join(granted, IN) }]);
  });

  it('caps the entries of one burst like a listing', async () => {
    const { granted, fakes, listener } = world;
    access = world.open({ limits: { entries: 3 } });
    await access.watch(granted, { recursive: true }, listener);
    for (const name of ['a', 'b', 'c', 'd', 'e']) fakes[0]?.signal('rename', name);
    await vi.waitFor(() => expect(world.events).toHaveLength(3));
    await pause(40);
    expect(seen()).toEqual(['a', 'b', 'c'].map((name) => ({ kind: 'remove', path: join(granted, name) })));
  });
});

describe('the end of a watch', () => {
  it('stops on unsubscribe, once, and ignores later signals', async () => {
    const { granted, fakes, listener, events } = world;
    const stop = await access.watch(granted, {}, listener);
    fakes[0]?.signal('change', IN);
    stop();
    stop();
    fakes[0]?.signal('change', IN);
    await pause(40);
    expect(fakes[0]?.closed).toBe(1);
    expect(events).toEqual([]);
  });

  it('stops on revoke, and drops what was waiting', async () => {
    const { base, granted, fakes, listener, events } = world;
    await access.watch(granted, {}, listener);
    const other = join(base, 'other');
    await mkdir(other);
    access.allowFolder(other);
    await access.watch(other, {}, listener);
    fakes[0]?.signal('change', IN);
    expect(access.revokeFolder(granted)).toBe(true);
    await pause(40);
    expect(fakes.map((fake) => fake.closed)).toEqual([1, 0]);
    expect(events).toEqual([]);
  });

  it('stops when the watcher reports an error', async () => {
    const { granted, fakes, listener } = world;
    await access.watch(granted, {}, listener);
    fakes[0]?.fail();
    expect(fakes[0]?.closed).toBe(1);
  });
});
