/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, symlink } from 'fs/promises';
import { join } from 'path';
import type { NativeImage } from 'electron';
import { dragOut } from '../src/main/dnd/drag-out';
import { dots, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const icon = {} as NativeImage;

let world: OpsWorld;
let started: string[][];

beforeEach(async () => {
  world = await openWorld('brock-dragout-');
  started = [];
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

const run = (paths: unknown, fromApp = true): Promise<void> =>
  dragOut(
    {
      resolve: (path) => world.access.resolve(path),
      fromApp: () => fromApp,
      icon: () => Promise.resolve(icon),
      start: (files) => started.push(files),
    },
    paths,
  );

describe('drag out', () => {
  it('starts a drag for files and folders inside a granted folder', async () => {
    const { granted } = world;
    await put(join(granted, 'tree', 'a.txt'));
    await run([join(granted, 'sub', 'in.txt'), join(granted, 'tree')]);
    expect(started).toEqual([[join(granted, 'sub', 'in.txt'), join(granted, 'tree')]]);
  });

  it('starts a drag for a file the user picked and sends a path once', async () => {
    const { access, outside } = world;
    const picked = access.allow(join(outside, 'secret.txt'));
    await run([picked, picked]);
    expect(started).toEqual([[picked]]);
  });

  it('asks the icon of the first file', async () => {
    const { granted } = world;
    const asked = vi.fn(() => Promise.resolve(icon));
    await dragOut({ resolve: (path) => world.access.resolve(path), fromApp: () => true, icon: asked, start: () => undefined }, [join(granted, 'sub', 'in.txt')]);
    expect(asked).toHaveBeenCalledWith(join(granted, 'sub', 'in.txt'));
  });
});

describe('drag out refusals', () => {
  it('refuses a path outside every grant, an unsafe shape and a missing file', async () => {
    const { granted, outside } = world;
    for (const path of [join(outside, 'secret.txt'), dots(granted, 'outside', 'secret.txt'), 'relative.txt', '', join(granted, 'gone.txt')]) {
      await expect(run([path]), path).rejects.toThrow();
    }
    expect(started).toEqual([]);
  });

  it('refuses the whole request when one path is refused, and starts nothing', async () => {
    const { granted, outside } = world;
    await expect(run([join(granted, 'sub', 'in.txt'), join(outside, 'secret.txt')])).rejects.toThrow(/may not use/);
    expect(started).toEqual([]);
  });

  it('refuses a path that a link leads outside', async () => {
    const { granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(run([join(granted, 'out', 'secret.txt')])).rejects.toThrow(/may not use/);
    await expect(run([join(granted, 'out')])).rejects.toThrow(/may not use/);
    expect(started).toEqual([]);
  });

  it('drags the real path of a link that stays inside the grant, never the link', async () => {
    const { granted } = world;
    await symlink(join(granted, 'sub'), join(granted, 'shortcut'), dirLink);
    await run([join(granted, 'shortcut')]);
    expect(started).toEqual([[join(granted, 'sub')]]);
  });

  it('refuses the app own folders', async () => {
    const { appDir } = world;
    await expect(run([join(appDir, 'Data', 'app.json')])).rejects.toThrow(/may not use/);
    expect(started).toEqual([]);
  });

  it('refuses a call that did not come from the app window', async () => {
    await expect(run([join(world.granted, 'sub', 'in.txt')], false)).rejects.toThrow(/Only the app window/);
    expect(started).toEqual([]);
  });

  it('refuses a body that is not a list of 1 to 100 strings', async () => {
    const { granted } = world;
    const file = join(granted, 'sub', 'in.txt');
    for (const bad of [undefined, null, file, [], [5], [null], [{}], Array.from({ length: 101 }, () => file)]) {
      await expect(run(bad), JSON.stringify(bad)).rejects.toThrow(/needs/);
    }
    expect(started).toEqual([]);
  });
});
