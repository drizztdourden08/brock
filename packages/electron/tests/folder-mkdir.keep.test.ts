/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { rm, symlink } from 'fs/promises';
import { join } from 'path';
import { dots, names, openWorld } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;

beforeEach(async () => {
  world = await openWorld('brock-mkdir-');
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('mkdir', () => {
  it('creates a folder, and a chain only when recursive', async () => {
    const { access, granted } = world;
    await access.mkdir(join(granted, 'one'));
    expect(existsSync(join(granted, 'one'))).toBe(true);
    await expect(access.mkdir(join(granted, 'a', 'b', 'c'))).rejects.toThrow();
    await access.mkdir(join(granted, 'a', 'b', 'c'), { recursive: true });
    expect(existsSync(join(granted, 'a', 'b', 'c'))).toBe(true);
  });

  it('fails for an existing folder unless recursive', async () => {
    const { access, granted } = world;
    await expect(access.mkdir(join(granted, 'sub'))).rejects.toThrow(/EEXIST/);
    await access.mkdir(join(granted, 'sub'), { recursive: true });
  });

  it('refuses the grant root, a path outside and a path that is not plain', async () => {
    const { access, granted, outside } = world;
    for (const path of [granted, join(outside, 'new'), dots(granted, 'outside', 'new'), 'relative']) {
      await expect(access.mkdir(path, { recursive: true }), path).rejects.toThrow();
    }
    expect(await names(outside)).toEqual(['secret.txt']);
  });

  it('refuses a link that leads outside, at any level', async () => {
    const { access, granted, outside } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(access.mkdir(join(granted, 'out', 'new'))).rejects.toThrow(/not inside a granted folder/);
    await expect(access.mkdir(join(granted, 'out', 'a', 'b'), { recursive: true })).rejects.toThrow(/not inside a granted folder/);
    expect(await names(outside)).toEqual(['secret.txt']);
  });

  it('refuses folders the write classes protect, in any case, also when recursive', async () => {
    const { access, granted } = world;
    const refused = ['.git', join('proj', '.git'), join('proj', '.GIT', 'hooks'), '.husky', '.vscode', '.idea', '.devcontainer', join('.github', 'workflows'), join('x', '.config', 'autostart'), '.ssh', 'danger.lnk', 'HEAD'];
    for (const dir of refused) {
      await expect(access.mkdir(join(granted, dir), { recursive: true }), dir).rejects.toThrow(/may not be changed/);
    }
    expect(await names(granted)).toEqual(['app', 'sub']);
  });

  it('allows a folder next to the protected ones, such as .github on its own', async () => {
    const { access, granted } = world;
    await access.mkdir(join(granted, '.github'));
    await access.mkdir(join(granted, 'docs', 'git'), { recursive: true });
    expect(await names(granted)).toContain('.github');
  });

  it('refuses the app folders', async () => {
    const { access, appDir } = world;
    await expect(access.mkdir(join(appDir, 'Data', 'new'))).rejects.toThrow(/may not be changed/);
    await expect(access.mkdir(join(appDir, 'new'), { recursive: true })).rejects.toThrow(/may not be changed/);
  });

  it.runIf(process.platform === 'win32')('refuses a device name and a trailing dot on Windows', async () => {
    const { access, granted } = world;
    for (const name of ['CON', 'lpt1', 'x.', 'a:b']) await expect(access.mkdir(join(granted, name)), name).rejects.toThrow();
  });
});
