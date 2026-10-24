/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdir, rm, symlink } from 'fs/promises';
import { join } from 'path';
import type * as FsPromises from 'fs/promises';
import { realPathOf } from '../src/main/documents/real-path-of';
import { makeBase } from './folder-fixture';

const race = vi.hoisted(() => ({ misses: new Map<string, number>() }));

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof FsPromises>();
  const realpath = async (path: string): Promise<string> => {
    const left = race.misses.get(path) ?? 0;
    if (left > 0) {
      race.misses.set(path, left - 1);
      throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
    }
    return actual.realpath(path);
  };
  return { ...actual, realpath };
});

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let base = '';

beforeEach(async () => {
  base = await makeBase('brock-realpath-');
  race.misses.clear();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('the real path of a path that may not exist yet', () => {
  it('resolves a folder that another write created between the two looks', async () => {
    await mkdir(join(base, 'made', 'inner'), { recursive: true });
    race.misses.set(join(base, 'made', 'inner', 'file.txt'), 1);
    race.misses.set(join(base, 'made', 'inner'), 2);
    expect(await realPathOf(join(base, 'made', 'inner', 'file.txt'))).toBe(join(base, 'made', 'inner', 'file.txt'));
  });

  it('gives up on a folder that stays unresolvable although it exists', async () => {
    await mkdir(join(base, 'odd'));
    race.misses.set(join(base, 'odd'), 50);
    expect(await realPathOf(join(base, 'odd', 'x'))).toBeNull();
  });

  it('resolves the missing tail below the deepest existing folder', async () => {
    expect(await realPathOf(join(base, 'a', 'b', 'c.txt'))).toBe(join(base, 'a', 'b', 'c.txt'));
  });

  it('still refuses a dangling link, also in the middle of the path', async () => {
    await symlink(join(base, 'nowhere'), join(base, 'dangling'), dirLink);
    expect(await realPathOf(join(base, 'dangling'))).toBeNull();
    expect(await realPathOf(join(base, 'dangling', 'x.txt'))).toBeNull();
  });
});
