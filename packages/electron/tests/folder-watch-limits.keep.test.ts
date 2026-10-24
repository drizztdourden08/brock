/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, symlink, writeFile } from 'fs/promises';
import { join, sep } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { loose, testAccess } from './folder-fixture';
import { openWatchWorld } from './watch-fixture';
import type { WatchWorld } from './watch-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: WatchWorld;
let access: DocumentAccess;

const pathsOf = (): string[] => world.events.map((event) => event.path);

beforeEach(async () => {
  world = await openWatchWorld('brock-watch-limits-');
  access = world.open();
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('what a watch refuses', () => {
  it('a folder outside a grant, a file, a path that is not plain, a missing folder and the app folders', async () => {
    const { granted, outside, appDir, fakes, listener } = world;
    const dotted = [granted, '..', 'outside'].join(sep);
    for (const path of [outside, join(granted, 'sub', 'in.txt'), dotted, 'relative', join(granted, 'gone'), join(appDir, 'Data')]) {
      await expect(access.watch(path, {}, listener), path).rejects.toThrow();
    }
    expect(fakes).toEqual([]);
  });

  it('a missing listener, and a link that leads outside the grant', async () => {
    const { granted, outside, fakes, listener } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(access.watch(granted, {}, loose(undefined))).rejects.toThrow(/listener/);
    await expect(access.watch(join(granted, 'out'), {}, listener)).rejects.toThrow(/not inside a granted folder/);
    expect(fakes).toEqual([]);
  });

  it('more than 32 at once, and frees one on unsubscribe', async () => {
    const { granted, listener } = world;
    const stops: (() => void)[] = [];
    for (let count = 0; count < 32; count += 1) stops.push(await access.watch(granted, {}, listener));
    await expect(access.watch(granted, {}, listener)).rejects.toThrow(/Too many/);
    stops[0]?.();
    await access.watch(granted, {}, listener);
  });
});

describe('what a watch passes on', () => {
  it('passes recursive only when it is true, and watches the real path of a subfolder', async () => {
    const { granted, fakes, listener } = world;
    await access.watch(granted, { recursive: true }, listener);
    await access.watch(join(granted, 'sub'), loose({ recursive: 'yes' }), listener);
    await access.watch(granted, undefined, listener);
    expect(fakes.map(({ dir, recursive }) => [dir, recursive])).toEqual([[granted, true], [join(granted, 'sub'), false], [granted, false]]);
  });

  it('reports a file made and removed in a subfolder through the real file system', async () => {
    const { granted, listener, events } = world;
    const real = testAccess({ watchMs: 20 });
    real.allowFolder(granted);
    const stop = await real.watch(granted, { recursive: true }, listener);
    const file = join(granted, 'sub', 'live.txt');
    await writeFile(file, 'x');
    await vi.waitFor(() => expect(pathsOf()).toContain(file), { timeout: 5000 });
    await rm(file);
    await vi.waitFor(() => expect(events).toContainEqual({ kind: 'remove', path: file }), { timeout: 5000 });
    stop();
  });
});
