/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink } from 'fs/promises';
import { join } from 'path';
import { loose } from './folder-fixture';
import { dots, names, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const marked = vi.hoisted(() => vi.fn<(path: string) => Promise<void>>());

vi.mock('../src/main/documents/mark-of-the-web', () => ({ markOfTheWeb: marked }));

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;

beforeEach(async () => {
  world = await openWorld('brock-rename-');
  marked.mockReset();
  marked.mockResolvedValue();
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('rename', () => {
  it('renames a file and a folder inside the grant, and moves a file to another folder', async () => {
    const { access, granted } = world;
    await access.rename(join(granted, 'sub', 'in.txt'), join(granted, 'sub', 'out.txt'));
    await mkdir(join(granted, 'other'));
    await access.rename(join(granted, 'sub', 'out.txt'), join(granted, 'other', 'out.txt'));
    await access.rename(join(granted, 'other'), join(granted, 'moved'));
    expect(await readFile(join(granted, 'moved', 'out.txt'), 'utf8')).toBe('inside');
    expect(await names(granted)).toEqual(['app', 'moved', 'sub']);
  });

  it('fails when the target exists, unless overwrite is true', async () => {
    const { access, granted } = world;
    await put(join(granted, 'a.txt'), 'A');
    await put(join(granted, 'b.txt'), 'B');
    await expect(access.rename(join(granted, 'a.txt'), join(granted, 'b.txt'))).rejects.toThrow(/already exists/);
    await expect(access.rename(join(granted, 'a.txt'), join(granted, 'b.txt'), loose({ overwrite: 'yes' }))).rejects.toThrow(/already exists/);
    expect(await readFile(join(granted, 'b.txt'), 'utf8')).toBe('B');
    await access.rename(join(granted, 'a.txt'), join(granted, 'b.txt'), { overwrite: true });
    expect(await readFile(join(granted, 'b.txt'), 'utf8')).toBe('A');
    expect(existsSync(join(granted, 'a.txt'))).toBe(false);
  });

  it('changes only the case of a name without overwrite', async () => {
    const { access, granted } = world;
    await put(join(granted, 'Case.txt'), 'c');
    await access.rename(join(granted, 'Case.txt'), join(granted, 'case.txt'));
    expect((await names(granted)).filter((name) => name.toLowerCase() === 'case.txt')).toEqual(['case.txt']);
  });

  it('refuses a path outside, a root and the folder into itself', async () => {
    const { access, granted, outside, base } = world;
    const inside = join(granted, 'sub', 'in.txt');
    const cases: [string, string][] = [
      [join(outside, 'secret.txt'), join(granted, 'x.txt')],
      [inside, join(outside, 'x.txt')],
      [granted, join(base, 'renamed')],
      [inside, granted],
      [inside, dots(granted, 'outside', 'x.txt')],
    ];
    for (const [from, to] of cases) await expect(access.rename(from, to), `${from} -> ${to}`).rejects.toThrow();
    await expect(access.rename(join(granted, 'sub'), join(granted, 'sub', 'deeper'))).rejects.toThrow(/into itself/);
    await expect(access.rename(join(granted, 'gone.txt'), join(granted, 'x.txt'))).rejects.toThrow(/does not exist/);
    expect(await readFile(inside, 'utf8')).toBe('inside');
    expect(await readFile(join(outside, 'secret.txt'), 'utf8')).toBe('secret');
  });

  it('refuses a target that a link leads outside, even with overwrite', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await put(join(granted, 'a.txt'));
    for (const to of [join(granted, 'out', 'x.txt'), join(granted, 'out', 'secret.txt'), join(granted, 'out')]) {
      await expect(access.rename(join(granted, 'a.txt'), to, { overwrite: true }), to).rejects.toThrow(/not inside a granted folder/);
    }
    expect(await names(outside)).toEqual(['secret.txt']);
  });
});

describe('rename checked as a write', () => {
  it('refuses repository, autostart, lure and git directory names as the target', async () => {
    const { access, granted } = world;
    const refused = [join('proj', '.git'), join('proj', '.git', 'hooks'), join('proj', '.vscode', 'tasks.json'), join('proj', '.github', 'workflows', 'ci.yml'), '.bashrc', 'a.lnk', 'desktop.ini', 'HEAD'];
    await put(join(granted, 'plain.txt'));
    await mkdir(join(granted, 'proj'), { recursive: true });
    for (const target of refused) {
      await expect(access.rename(join(granted, 'plain.txt'), join(granted, target)), target).rejects.toThrow(/may not be changed/);
      await expect(access.rename(join(granted, 'plain.txt'), join(granted, target), { overwrite: true }), target).rejects.toThrow(/may not be changed/);
    }
    expect(existsSync(join(granted, 'plain.txt'))).toBe(true);
  });

  it('checks the source too, and refuses an existing class target with overwrite', async () => {
    const { access, granted } = world;
    await put(join(granted, 'proj', '.git', 'config'));
    await put(join(granted, 'danger.lnk'));
    await put(join(granted, 'plain.txt'));
    await expect(access.rename(join(granted, 'proj', '.git', 'config'), join(granted, 'config'))).rejects.toThrow(/may not be changed/);
    await expect(access.rename(join(granted, 'danger.lnk'), join(granted, 'danger.txt'))).rejects.toThrow(/may not be changed/);
    await expect(access.rename(join(granted, 'plain.txt'), join(granted, 'danger.lnk'), { overwrite: true })).rejects.toThrow(/may not be changed/);
    expect(await names(granted)).toContain('danger.lnk');
  });

  it('refuses the app folders as source or target, and a folder that holds them', async () => {
    const { access, granted, appDir } = world;
    await put(join(granted, 'plain.txt'));
    await expect(access.rename(join(granted, 'plain.txt'), join(appDir, 'Data', 'x.json'))).rejects.toThrow(/may not be changed/);
    await expect(access.rename(join(appDir, 'Data', 'app.json'), join(granted, 'app.json'))).rejects.toThrow(/may not be changed/);
    await expect(access.rename(appDir, join(granted, 'app2'))).rejects.toThrow(/holds one of the app's own folders|may not be changed/);
    await expect(access.rename(join(granted, 'plain.txt'), appDir, { overwrite: true })).rejects.toThrow();
    expect(existsSync(join(appDir, 'Data', 'app.json'))).toBe(true);
  });

  it('marks a file renamed to a risky extension, and nothing else', async () => {
    const { access, granted } = world;
    await put(join(granted, 'a.txt'));
    await mkdir(join(granted, 'dir'));
    await access.rename(join(granted, 'a.txt'), join(granted, 'a.cmd'));
    expect(marked.mock.calls.map(([path]) => path)).toEqual([join(granted, 'a.cmd')]);
    marked.mockClear();
    await access.rename(join(granted, 'dir'), join(granted, 'dir.cmd'));
    await expect(access.rename(join(granted, 'a.cmd'), join(granted, '.bashrc'))).rejects.toThrow();
    expect(marked).not.toHaveBeenCalled();
  });

  it.runIf(process.platform === 'win32')('refuses a device name and an alternate data stream as the target on Windows', async () => {
    const { access, granted } = world;
    await put(join(granted, 'a.txt'));
    for (const name of ['CON', 'aux.txt', 'x.', 'a.txt:stream']) await expect(access.rename(join(granted, 'a.txt'), join(granted, name)), name).rejects.toThrow();
    expect(existsSync(join(granted, 'a.txt'))).toBe(true);
  });
});
