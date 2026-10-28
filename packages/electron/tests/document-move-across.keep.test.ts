/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync } from 'fs';
import { mkdir, readFile, rm, symlink } from 'fs/promises';
import { join } from 'path';
import { makeBase } from './folder-fixture';
import { names, openWorld, put } from './folder-ops-fixture';
import type { OpsWorld } from './folder-ops-fixture';

const faults = vi.hoisted(() => ({
  crossDevice: new Set<string>(),
  unlinkFails: new Set<string>(),
}));

const marked = vi.hoisted(() => vi.fn<(path: string) => Promise<void>>());

vi.mock('../src/main/documents/mark-of-the-web', () => ({ markOfTheWeb: marked }));

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs/promises')>();
  return {
    ...actual,
    rename: (from: string, to: string) => {
      if (faults.crossDevice.has(from)) return Promise.reject(Object.assign(new Error('cross-device link not permitted'), { code: 'EXDEV' }));
      return actual.rename(from, to);
    },
    unlink: (path: string) => {
      if (faults.unlinkFails.has(path)) return Promise.reject(Object.assign(new Error('operation not permitted'), { code: 'EPERM' }));
      return actual.unlink(path);
    },
  };
});

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

let world: OpsWorld;
let second = '';

beforeEach(async () => {
  world = await openWorld('brock-move-');
  second = await makeBase('brock-move-second-');
  world.access.allowFolder(second);
  faults.crossDevice.clear();
  faults.unlinkFails.clear();
  marked.mockReset();
  marked.mockResolvedValue();
});

afterEach(async () => {
  await rm(world.base, { recursive: true, force: true });
  await rm(second, { recursive: true, force: true });
});

const leftovers = async (dir: string): Promise<string[]> => (await names(dir)).filter((name) => name.includes('brock-copy'));

describe('rename between two granted folders', () => {
  it('moves a file and a folder from one grant to another on the same drive', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a.txt'), 'A');
    await access.rename(join(granted, 'sub', 'in.txt'), join(second, 'in.txt'));
    await access.rename(join(granted, 'tree'), join(second, 'tree'));
    expect(await readFile(join(second, 'in.txt'), 'utf8')).toBe('inside');
    expect(await readFile(join(second, 'tree', 'a.txt'), 'utf8')).toBe('A');
    expect(existsSync(join(granted, 'sub', 'in.txt'))).toBe(false);
    expect(existsSync(join(granted, 'tree'))).toBe(false);
  });

  it('still refuses a source or a target outside every grant', async () => {
    const { access, granted, outside } = world;
    await expect(access.rename(join(outside, 'secret.txt'), join(second, 'x.txt'))).rejects.toThrow();
    await expect(access.rename(join(granted, 'sub', 'in.txt'), join(outside, 'x.txt'))).rejects.toThrow();
    expect(await readFile(join(granted, 'sub', 'in.txt'), 'utf8')).toBe('inside');
    expect(await readFile(join(outside, 'secret.txt'), 'utf8')).toBe('secret');
  });
});

describe('rename across drives', () => {
  it('copies, verifies and then removes a file', async () => {
    const { access, granted } = world;
    const from = join(granted, 'sub', 'in.txt');
    faults.crossDevice.add(from);
    await access.rename(from, join(second, 'moved.txt'));
    expect(await readFile(join(second, 'moved.txt'), 'utf8')).toBe('inside');
    expect(existsSync(from)).toBe(false);
    expect(await leftovers(second)).toEqual([]);
    expect(marked).toHaveBeenCalledWith(join(second, 'moved.txt'));
  });

  it('copies a folder tree, verifies it and removes the original from the deepest entry up', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a', 'one.txt'), '1');
    await put(join(granted, 'tree', 'two.txt'), '2');
    await mkdir(join(granted, 'tree', 'empty'));
    faults.crossDevice.add(join(granted, 'tree'));
    await access.rename(join(granted, 'tree'), join(second, 'tree'));
    expect(await readFile(join(second, 'tree', 'a', 'one.txt'), 'utf8')).toBe('1');
    expect(await readFile(join(second, 'tree', 'two.txt'), 'utf8')).toBe('2');
    expect(existsSync(join(second, 'tree', 'empty'))).toBe(true);
    expect(existsSync(join(granted, 'tree'))).toBe(false);
    expect(await leftovers(second)).toEqual([]);
  });

  it('replaces a file only when overwrite is true', async () => {
    const { access, granted } = world;
    const from = join(granted, 'sub', 'in.txt');
    await put(join(second, 'there.txt'), 'old');
    faults.crossDevice.add(from);
    await expect(access.rename(from, join(second, 'there.txt'))).rejects.toThrow(/already exists/);
    expect(await readFile(from, 'utf8')).toBe('inside');
    expect(await readFile(join(second, 'there.txt'), 'utf8')).toBe('old');
    await access.rename(from, join(second, 'there.txt'), { overwrite: true });
    expect(await readFile(join(second, 'there.txt'), 'utf8')).toBe('inside');
    expect(existsSync(from)).toBe(false);
  });

  it('keeps the original and leaves no copy when the copy does not verify', async () => {
    const { granted } = world;
    const from = join(granted, 'sub', 'in.txt');
    faults.crossDevice.add(from);
    vi.resetModules();
    vi.doMock('../src/main/documents/file-digest', () => ({ fileDigest: () => Promise.resolve('different') }));
    const { createDocumentAccess } = await import('../src/main/documents/document-access');
    const fresh = createDocumentAccess({ sensitiveRoots: () => ({ home: [], trees: [] }), protectedRoots: () => [world.appDir] });
    fresh.allowFolder(granted);
    fresh.allowFolder(second);
    await expect(fresh.rename(from, join(second, 'moved.txt'))).rejects.toThrow(/did not match/);
    vi.doUnmock('../src/main/documents/file-digest');
    expect(await readFile(from, 'utf8')).toBe('inside');
    expect(existsSync(join(second, 'moved.txt'))).toBe(false);
    expect(await names(second)).toEqual([]);
  });

  it('keeps the original when a folder changed while it was copied', async () => {
    const { granted } = world;
    await put(join(granted, 'tree', 'a.txt'), 'A');
    faults.crossDevice.add(join(granted, 'tree'));
    vi.resetModules();
    vi.doMock('../src/main/documents/same-tree', () => ({ sameTree: () => Promise.resolve(false) }));
    const { createDocumentAccess } = await import('../src/main/documents/document-access');
    const fresh = createDocumentAccess({ sensitiveRoots: () => ({ home: [], trees: [] }), protectedRoots: () => [world.appDir] });
    fresh.allowFolder(granted);
    fresh.allowFolder(second);
    await expect(fresh.rename(join(granted, 'tree'), join(second, 'tree'))).rejects.toThrow(/changed while it was being copied/);
    vi.doUnmock('../src/main/documents/same-tree');
    expect(await readFile(join(granted, 'tree', 'a.txt'), 'utf8')).toBe('A');
    expect(await names(second)).toEqual([]);
  });

  it('reports a partial removal and keeps the finished copy', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a.txt'), 'A');
    await put(join(granted, 'tree', 'b.txt'), 'B');
    faults.crossDevice.add(join(granted, 'tree'));
    faults.unlinkFails.add(join(granted, 'tree', 'a.txt'));
    await expect(access.rename(join(granted, 'tree'), join(second, 'tree'))).rejects.toThrow(/was copied to .* and checked, but it could not be fully removed/);
    expect(await readFile(join(second, 'tree', 'a.txt'), 'utf8')).toBe('A');
    expect(await readFile(join(second, 'tree', 'b.txt'), 'utf8')).toBe('B');
    expect(await readFile(join(granted, 'tree', 'a.txt'), 'utf8')).toBe('A');
  });

  it('refuses a link, since a copy never carries one', async () => {
    const { access, granted } = world;
    await symlink(join(granted, 'sub'), join(granted, 'shortcut'), dirLink);
    faults.crossDevice.add(join(granted, 'shortcut'));
    await expect(access.rename(join(granted, 'shortcut'), join(second, 'shortcut'))).rejects.toThrow(/link/);
    expect(existsSync(join(second, 'shortcut'))).toBe(false);
  });

  it('refuses a folder that holds a link and leaves the original whole', async () => {
    const { access, granted } = world;
    await put(join(granted, 'tree', 'a.txt'), 'A');
    await symlink(join(granted, 'sub'), join(granted, 'tree', 'loop'), dirLink);
    faults.crossDevice.add(join(granted, 'tree'));
    await expect(access.rename(join(granted, 'tree'), join(second, 'tree'))).rejects.toThrow(/link/);
    expect(await readFile(join(granted, 'tree', 'a.txt'), 'utf8')).toBe('A');
    expect(await names(second)).toEqual([]);
  });
});
