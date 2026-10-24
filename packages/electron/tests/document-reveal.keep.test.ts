/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rm } from 'fs/promises';
import { join } from 'path';
import { makeTree, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';
import type { DocumentAccess } from '../src/main/documents/document-access.type';

interface World {
  base: string;
  granted: string;
  outside: string;
  access: DocumentAccess;
  shown: string[];
}

let world: World;

beforeEach(async () => {
  const tree = await makeTree('brock-reveal-');
  const shown: string[] = [];
  const access = testAccess({ showItemInFolder: (path) => void shown.push(path) });
  access.allowFolder(tree.granted);
  world = { ...tree, access, shown };
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
});

describe('reveal', () => {
  it('shows a file and a folder inside a granted folder', async () => {
    const { access, granted, shown } = world;
    const file = join(granted, 'sub', 'in.txt');
    expect(await access.reveal(file)).toEqual({ revealed: true });
    expect(await access.reveal(join(granted, 'sub'))).toEqual({ revealed: true });
    expect(shown).toEqual([file, join(granted, 'sub')]);
  });

  it('shows a file the user picked and refuses its neighbour', async () => {
    const { access, outside, shown } = world;
    const picked = access.allow(join(outside, 'secret.txt'));
    expect(await access.reveal(picked)).toEqual({ revealed: true });
    const refused = await access.reveal(join(outside, 'other.txt'));
    expect(refused.revealed).toBe(false);
    expect(refused.reason).toMatch(/may not use/);
    expect(shown).toEqual([picked]);
  });

  it('refuses a path outside every grant, an unsafe shape and a path that does not exist', async () => {
    const { access, granted, outside, shown } = world;
    for (const path of [join(outside, 'secret.txt'), [granted, '..', 'outside', 'secret.txt'].join('/'), 'relative.txt', '']) {
      expect((await access.reveal(path)).revealed, path).toBe(false);
    }
    const missing = await access.reveal(join(granted, 'gone.txt'));
    expect(missing.revealed).toBe(false);
    expect(missing.reason).toMatch(/does not exist/);
    expect(shown).toEqual([]);
  });

  it('refuses a network path and never touches the file manager', async () => {
    const { access, shown } = world;
    for (const path of ['\\\\server\\share\\a.txt', '//server/share/a.txt']) {
      expect((await access.reveal(path)).revealed, path).toBe(false);
    }
    expect(shown).toEqual([]);
  });

  it('refuses the app own folders under a broader grant', async () => {
    const { granted, shown } = world;
    const guarded = testAccess({ protectedRoots: () => [join(granted, 'sub')], showItemInFolder: (path) => void shown.push(path) });
    guarded.allowFolder(granted);
    expect((await guarded.reveal(join(granted, 'sub', 'in.txt'))).revealed).toBe(false);
    expect(shown).toEqual([]);
  });

  it('answers not revealed when the host has no file manager', async () => {
    const { granted } = world;
    const bare = testAccess();
    bare.allowFolder(granted);
    const answer = await bare.reveal(join(granted, 'sub', 'in.txt'));
    expect(answer.revealed).toBe(false);
    expect(answer.reason).toMatch(/not available/);
  });

  it.runIf(process.platform === 'win32')('refuses a device name on Windows', async () => {
    const { access, granted, shown } = world;
    expect((await access.reveal(join(granted, 'NUL'))).revealed).toBe(false);
    expect(shown).toEqual([]);
  });
});

describe('reveal over the document channel', () => {
  it('answers the result instead of throwing', async () => {
    const { access, granted, outside, shown } = world;
    const call: Call = sessionOf({ documents: access });
    expect(await call('document:reveal', join(granted, 'sub', 'in.txt'))).toEqual({ revealed: true });
    expect(await call('document:reveal', join(outside, 'secret.txt'))).toMatchObject({ revealed: false });
    expect(shown).toEqual([join(granted, 'sub', 'in.txt')]);
  });
});
