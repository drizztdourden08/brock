/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm, symlink } from 'fs/promises';
import { join } from 'path';
import type * as Fs from 'fs';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree, testAccess } from './folder-fixture';

const disk = vi.hoisted(() => ({ native: vi.fn<(path: string) => string>() }));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof Fs>();
  const realNative = actual.realpathSync.native;
  disk.native.mockImplementation((path) => realNative(path));
  const wrapped = Object.assign((path: string) => actual.realpathSync(path), { native: disk.native });
  return { ...actual, realpathSync: wrapped };
});

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';
const SHAPES = ['\\\\server\\share\\folder', '//server/share/folder', '\\\\.\\pipe\\evil', '\\\\?\\C:\\folder', 'C:\\COM1', 'C:\\folder\\NUL', 'C:\\folder:stream', 'C:\\folder.', '\\\\localhost\\c$\\folder'];

let base = '';
let granted = '';
let outside = '';
let access: DocumentAccess;

beforeEach(async () => {
  ({ base, granted, outside } = await makeTree('brock-revoke-'));
  access = testAccess();
  access.allowFolder(granted);
  disk.native.mockClear();
});

afterEach(async () => {
  await rm(base, { recursive: true, force: true });
});

describe('revoking a folder from renderer input', () => {
  it.runIf(process.platform === 'win32')('refuses network, device and stream shapes without touching the disk', () => {
    for (const shape of SHAPES) expect(access.revokeFolder(shape), shape).toBe(false);
    expect(disk.native).not.toHaveBeenCalled();
  });

  it('answers false for a path that is not granted without touching the disk, and keeps the grant', async () => {
    expect(access.revokeFolder(outside)).toBe(false);
    expect(access.revokeFolder(join(granted, 'sub'))).toBe(false);
    expect(disk.native).not.toHaveBeenCalled();
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).resolves.toBeTruthy();
  });

  it('matches the stored root and the spelling the grant was made with, by name only', () => {
    expect(access.revokeFolder(granted)).toBe(true);
    expect(access.revokeFolder(granted)).toBe(false);
    access.allowFolder(granted);
    expect(access.revokeFolder(granted)).toBe(true);
    expect(disk.native).toHaveBeenCalledTimes(1);
  });

  it('does not resolve a link to find the root: only a name the grant knows revokes it', async () => {
    await symlink(granted, join(base, 'alias'), dirLink);
    disk.native.mockClear();
    expect(access.revokeFolder(join(base, 'alias'))).toBe(false);
    expect(disk.native).not.toHaveBeenCalled();
    await expect(access.resolve(join(granted, 'sub', 'in.txt'))).resolves.toBeTruthy();
    access.allowFolder(join(base, 'alias'));
    expect(access.revokeFolder(join(base, 'alias'))).toBe(true);
    expect(access.revokeFolder(granted)).toBe(false);
  });

  it('rejects a path that is not absolute', () => {
    expect(() => access.revokeFolder('relative')).toThrow(/absolute/);
  });
});
