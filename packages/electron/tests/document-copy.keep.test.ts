/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { dots, names, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';
import { loose, sessionOf } from './folder-fixture';

const marked = vi.hoisted(() => vi.fn<(path: string) => Promise<void>>());

vi.mock('../src/main/documents/mark-of-the-web', () => ({ markOfTheWeb: marked }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;

beforeEach(async () => {
  world = await openWorld('brock-copy-');
  marked.mockReset();
  marked.mockResolvedValue();
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('copy', () => {
  it('copies a file inside the grant and leaves the original', async () => {
    const { access, granted } = world;
    await access.copy(join(granted, 'sub', 'in.txt'), join(granted, 'copy.txt'));
    expect(await readFile(join(granted, 'copy.txt'), 'utf8')).toBe('inside');
    expect(await readFile(join(granted, 'sub', 'in.txt'), 'utf8')).toBe('inside');
    expect(marked).toHaveBeenCalledWith(join(granted, 'copy.txt'));
    expect((await names(granted)).filter((name) => name.includes('brock-copy'))).toEqual([]);
  });

  it('copies a folder tree with its files and empty folders', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a', 'one.txt'), '1');
    await put(join(granted, 'tree', 'two.txt'), '2');
    await mkdir(join(granted, 'tree', 'empty'));
    await access.copy(join(granted, 'tree'), join(granted, 'twin'));
    expect(await readFile(join(granted, 'twin', 'a', 'one.txt'), 'utf8')).toBe('1');
    expect(await readFile(join(granted, 'twin', 'two.txt'), 'utf8')).toBe('2');
    expect(existsSync(join(granted, 'twin', 'empty'))).toBe(true);
    expect(existsSync(join(granted, 'tree', 'a', 'one.txt'))).toBe(true);
    expect(await names(granted)).toEqual(['app', 'sub', 'tree', 'twin']);
  });

  it('copies a file the user picked into a granted folder', async () => {
    const { access, granted, outside } = world;
    const picked = access.allow(join(outside, 'secret.txt'));
    await access.copy(picked, join(granted, 'imported.txt'));
    expect(await readFile(join(granted, 'imported.txt'), 'utf8')).toBe('secret');
  });

  it('copies between two granted folders', async () => {
    const { access, granted, outside } = world;
    access.allowFolder(outside);
    await access.copy(join(outside, 'secret.txt'), join(granted, 'from-outside.txt'));
    expect(await readFile(join(granted, 'from-outside.txt'), 'utf8')).toBe('secret');
  });

  it('fails when the target exists, and overwrites a file only when asked', async () => {
    const { access, granted } = world;
    await put(join(granted, 'a.txt'), 'A');
    await put(join(granted, 'b.txt'), 'B');
    await expect(access.copy(join(granted, 'a.txt'), join(granted, 'b.txt'))).rejects.toThrow(/already exists/);
    await expect(access.copy(join(granted, 'a.txt'), join(granted, 'b.txt'), loose({ overwrite: 'yes' }))).rejects.toThrow(/already exists/);
    expect(await readFile(join(granted, 'b.txt'), 'utf8')).toBe('B');
    await access.copy(join(granted, 'a.txt'), join(granted, 'b.txt'), { overwrite: true });
    expect(await readFile(join(granted, 'b.txt'), 'utf8')).toBe('A');
    expect(await readFile(join(granted, 'a.txt'), 'utf8')).toBe('A');
  });

  it('never overwrites a folder', async () => {
    const { access, granted } = world;
    await put(join(granted, 'one', 'x.txt'), 'x');
    await put(join(granted, 'two', 'y.txt'), 'y');
    await expect(access.copy(join(granted, 'one'), join(granted, 'two'), { overwrite: true })).rejects.toThrow(/already exists/);
    expect(await readFile(join(granted, 'two', 'y.txt'), 'utf8')).toBe('y');
    expect(existsSync(join(granted, 'two', 'x.txt'))).toBe(false);
    expect((await names(granted)).filter((name) => name.includes('brock-copy'))).toEqual([]);
  });
});

describe('copy over IPC', () => {
  it('copies through document:copy and refuses an outside path the same way', async () => {
    const { access, granted, outside } = world;
    const call = sessionOf({ documents: access });
    await call('document:copy', join(granted, 'sub', 'in.txt'), join(granted, 'ipc.txt'));
    expect(await readFile(join(granted, 'ipc.txt'), 'utf8')).toBe('inside');
    await expect(call('document:copy', join(outside, 'secret.txt'), join(granted, 'no.txt'))).rejects.toThrow(/may not use/);
    await expect(call('document:copy', join(granted, 'sub', 'in.txt'), join(outside, 'no.txt'))).rejects.toThrow(/not inside a granted folder/);
  });
});

describe('copy refusals', () => {
  it('refuses a source or a target outside every grant, an unsafe shape and a missing source', async () => {
    const { access, granted, outside } = world;
    const inside = join(granted, 'sub', 'in.txt');
    const cases: [string, string][] = [
      [join(outside, 'secret.txt'), join(granted, 'x.txt')],
      [inside, join(outside, 'x.txt')],
      [inside, dots(granted, 'outside', 'x.txt')],
      [dots(granted, 'outside', 'secret.txt'), join(granted, 'x.txt')],
      ['relative.txt', join(granted, 'x.txt')],
      [inside, 'relative.txt'],
    ];
    for (const [from, to] of cases) await expect(access.copy(from, to), `${from} -> ${to}`).rejects.toThrow();
    await expect(access.copy(join(granted, 'gone.txt'), join(granted, 'x.txt'))).rejects.toThrow(/does not exist|may not use/);
    expect(await names(outside)).toEqual(['secret.txt']);
    expect(await names(granted)).toEqual(['app', 'sub']);
  });

  it('refuses a granted folder itself and the app own folders as the target or the source', async () => {
    const { access, granted, appDir } = world;
    const inside = join(granted, 'sub', 'in.txt');
    await expect(access.copy(inside, granted)).rejects.toThrow();
    await expect(access.copy(inside, join(appDir, 'Data', 'x.txt'))).rejects.toThrow();
    await expect(access.copy(join(appDir, 'Data', 'app.json'), join(granted, 'x.json'))).rejects.toThrow();
    await expect(access.copy(appDir, join(granted, 'app-copy'))).rejects.toThrow();
    expect(existsSync(join(granted, 'app-copy'))).toBe(false);
  });

  it('refuses a file onto itself and a folder into itself', async () => {
    const { access, granted } = world;
    await expect(access.copy(join(granted, 'sub', 'in.txt'), join(granted, 'sub', 'in.txt'), { overwrite: true })).rejects.toThrow(/onto itself/);
    await expect(access.copy(join(granted, 'sub'), join(granted, 'sub', 'deeper'))).rejects.toThrow(/into itself/);
    expect(await readFile(join(granted, 'sub', 'in.txt'), 'utf8')).toBe('inside');
  });

  it('refuses a target that a link leads outside, even with overwrite', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    for (const to of [join(granted, 'out', 'x.txt'), join(granted, 'out', 'secret.txt'), join(granted, 'out')]) {
      await expect(access.copy(join(granted, 'sub', 'in.txt'), to, { overwrite: true }), to).rejects.toThrow(/not inside a granted folder/);
    }
    expect(await names(outside)).toEqual(['secret.txt']);
    expect(await readFile(join(outside, 'secret.txt'), 'utf8')).toBe('secret');
  });

  it('refuses a source that a link leads outside', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(access.copy(join(granted, 'out', 'secret.txt'), join(granted, 'stolen.txt'))).rejects.toThrow(/may not use/);
    await expect(access.copy(join(granted, 'out'), join(granted, 'stolen'))).rejects.toThrow(/may not use/);
    expect(existsSync(join(granted, 'stolen.txt'))).toBe(false);
  });

  it('refuses a folder that holds a link, and leaves no half copy', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a.txt'), 'a');
    await symlink(join(granted, 'sub'), join(granted, 'tree', 'loop'), dirLink);
    await expect(access.copy(join(granted, 'tree'), join(granted, 'twin'))).rejects.toThrow(/link/);
    expect(await names(granted)).toEqual(['app', 'sub', 'tree']);
  });

  it('refuses repository, autostart, lure and git directory names as the target', async () => {
    const { access, granted } = world;
    await put(join(granted, 'plain.txt'));
    await mkdir(join(granted, 'proj'), { recursive: true });
    const refused = [join('proj', '.git'), join('proj', '.vscode', 'tasks.json'), '.bashrc', 'a.lnk', 'desktop.ini'];
    for (const target of refused) {
      await expect(access.copy(join(granted, 'plain.txt'), join(granted, target)), target).rejects.toThrow(/may not be changed|not inside a granted folder/);
      await expect(access.copy(join(granted, 'plain.txt'), join(granted, target), { overwrite: true }), target).rejects.toThrow(/may not be changed|not inside a granted folder/);
    }
    expect(await names(join(granted, 'proj'))).toEqual([]);
  });

  it('refuses a folder that would put a protected name in place', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'ok.txt'));
    await writeFile(join(granted, 'tree', 'plain.txt'), 'x');
    await expect(access.copy(join(granted, 'tree'), join(granted, '.git'))).rejects.toThrow();
    expect(existsSync(join(granted, '.git'))).toBe(false);
  });
});
