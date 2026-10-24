/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink } from 'fs/promises';
import { join } from 'path';
import { makeBase, testAccess } from './folder-fixture';
import { dots, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;

beforeEach(async () => {
  world = await openWorld('brock-trash-');
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('trash', () => {
  it('moves a file, an empty folder and a folder with content to the trash', async () => {
    const { access, granted, trashed } = world;
    const file = await put(join(granted, 'a.txt'));
    const empty = join(granted, 'empty');
    await mkdir(empty);
    const full = join(granted, 'sub');
    await access.trash(file);
    await access.trash(empty);
    await access.trash(full);
    expect(trashed).toEqual([file, empty, full]);
    expect(existsSync(file) || existsSync(empty) || existsSync(full)).toBe(false);
  });

  it('refuses the grant root itself, a path outside and a path that is not plain', async () => {
    const { access, granted, outside, trashed } = world;
    for (const path of [granted, join(outside, 'secret.txt'), dots(granted, 'outside', 'secret.txt'), 'relative.txt']) {
      await expect(access.trash(path), path).rejects.toThrow();
    }
    expect(trashed).toEqual([]);
    expect(await readFile(join(outside, 'secret.txt'), 'utf8')).toBe('secret');
  });

  it('refuses a link that leads outside, and what sits behind it', async () => {
    const { access, granted, outside, trashed } = world;
    await symlink(outside, join(granted, 'out'), dirLink);
    await expect(access.trash(join(granted, 'out'))).rejects.toThrow(/not inside a granted folder/);
    await expect(access.trash(join(granted, 'out', 'secret.txt'))).rejects.toThrow(/not inside a granted folder/);
    expect(trashed).toEqual([]);
  });

  it('refuses the write classes: repository, autostart, lure and git directory files', async () => {
    const { access, granted, trashed } = world;
    const refused = [join('proj', '.git', 'config'), join('proj', '.git'), join('proj', '.github', 'workflows', 'ci.yml'), '.bashrc', 'a.lnk', 'desktop.ini', join('proj', 'HEAD')];
    for (const file of refused) {
      if (!existsSync(join(granted, file))) await put(join(granted, file));
      await expect(access.trash(join(granted, file)), file).rejects.toThrow(/may not be changed/);
    }
    expect(trashed).toEqual([]);
  });

});

describe('trash and the app folders', () => {
  it('refuses the app folders, and a folder that holds them', async () => {
    const { access, appDir, trashed } = world;
    await expect(access.trash(appDir)).rejects.toThrow(/holds one of the app's own folders|may not be changed/);
    await expect(access.trash(join(appDir, 'Data', 'app.json'))).rejects.toThrow(/may not be changed/);
    const parent = await makeBase('brock-trash-hold-');
    const held = join(parent, 'held');
    await mkdir(join(held, 'inner'), { recursive: true });
    const holder = testAccess({ protectedRoots: () => [join(held, 'inner')], trashItem: (path) => Promise.resolve(void trashed.push(path)) });
    holder.allowFolder(parent);
    await expect(holder.trash(held)).rejects.toThrow(/holds one of the app's own folders/);
    expect(trashed).toEqual([]);
    await rm(parent, { recursive: true, force: true });
  });

  it('fails for a path that does not exist, and when the host has no trash', async () => {
    const { access, granted } = world;
    await expect(access.trash(join(granted, 'gone.txt'))).rejects.toThrow(/does not exist/);
    const bare = testAccess();
    bare.allowFolder(granted);
    await expect(bare.trash(join(granted, 'sub', 'in.txt'))).rejects.toThrow(/trash is not available/);
  });

  it.runIf(process.platform === 'win32')('refuses a device name and a trailing dot on Windows', async () => {
    const { access, granted, trashed } = world;
    for (const name of ['CON', 'nul.txt', 'x.']) await expect(access.trash(join(granted, name)), name).rejects.toThrow();
    expect(trashed).toEqual([]);
  });
});
