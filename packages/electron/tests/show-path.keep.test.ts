/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { openFolder } from '../src/main/files/open-folder';
import { revealPath } from '../src/main/files/reveal-path';

const calls = vi.hoisted(() => ({ opened: [] as string[], shown: [] as string[] }));

vi.mock('electron', () => ({
  shell: {
    openPath: (path: string) => { calls.opened.push(path); return Promise.resolve(''); },
    showItemInFolder: (path: string) => { calls.shown.push(path); },
  },
}));

let root = '';

beforeEach(async () => {
  calls.opened.length = 0;
  calls.shown.length = 0;
  root = await mkdtemp(join(tmpdir(), 'brock-show-'));
  await writeFile(join(root, 'engine.exe'), 'x');
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('openFolder', () => {
  it('opens a folder and refuses a file, a missing path and a relative path', async () => {
    expect(await openFolder(root)).toEqual({ success: true });
    const errorOf = async (path: string): Promise<string> => {
      const result = await openFolder(path);
      return result.success ? '' : result.error;
    };
    expect(await errorOf(join(root, 'engine.exe'))).toMatch(/not a folder/);
    expect(await errorOf(join(root, 'missing'))).toMatch(/does not exist/);
    expect(await errorOf('relative/dir')).toMatch(/absolute/);
    expect(calls.opened).toEqual([root]);
  });
});

describe('revealPath', () => {
  it('shows a file or a folder in its folder, and refuses a missing or relative path', async () => {
    expect(await revealPath(join(root, 'engine.exe'))).toEqual({ success: true });
    expect(await revealPath(root)).toEqual({ success: true });
    expect(await revealPath(join(root, 'missing.txt'))).toMatchObject({ success: false });
    expect(await revealPath('')).toMatchObject({ success: false });
    expect(calls.shown).toEqual([join(root, 'engine.exe'), root]);
    expect(calls.opened).toEqual([]);
  });
});
