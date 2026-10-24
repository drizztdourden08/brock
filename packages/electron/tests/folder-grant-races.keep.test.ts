/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { loose } from './folder-fixture';
import { regrantFolder } from '../src/main/documents/regrant-folder';
import { watchGranted } from '../src/main/documents/watch-granted';
import type { FolderGrants } from '../src/main/documents/folder-grants.type';
import type { RememberedFolders } from '../src/main/documents/remembered-folders.type';
import { createWatchRegistry } from '../src/main/documents/watch-registry';
import type { WatchFn } from '../src/main/documents/watch-folder.type';
import { makeBase } from './folder-fixture';

describe('a watch that starts while its grant is revoked', () => {
  it('is stopped and refused when the root is no longer held after it registered', async () => {
    const dir = await makeBase('brock-race-');
    const closed = vi.fn();
    const watcher: WatchFn = () => ({ close: closed });
    const registry = createWatchRegistry();
    let held = true;
    const folders = loose<FolderGrants>({
      contain: () => Promise.resolve(dir),
      rootOf: () => dir,
      holds: () => held,
    });
    const first = await watchGranted({ folders, registry, watcher, ms: 5, max: 10 }, dir, {}, vi.fn());
    expect(registry.size()).toBe(1);
    first();
    held = false;
    await expect(watchGranted({ folders, registry, watcher, ms: 5, max: 10 }, dir, {}, vi.fn())).rejects.toThrow(/revoked/);
    expect(registry.size()).toBe(0);
    expect(closed).toHaveBeenCalledTimes(2);
  });
});

describe('granting a remembered folder again', () => {
  it('grants the exact real path the checks ran on, with no second resolve', async () => {
    const calls: string[] = [];
    const folders = loose<FolderGrants>({
      vet: (path: string) => {
        calls.push(`vet ${path}`);
        return path;
      },
      adopt: (real: string) => {
        calls.push(`adopt ${real}`);
        return real;
      },
      allow: () => {
        throw new Error('allow resolves the path a second time');
      },
    });
    const memory = loose<RememberedFolders>({ find: () => Promise.resolve(process.platform === 'win32' ? 'C:\\art' : '/art') });
    const path = process.platform === 'win32' ? 'C:\\art' : '/art';
    expect(await regrantFolder(folders, memory, 'p1', path)).toBe(path);
    expect(calls).toEqual([`vet ${path}`, `adopt ${path}`]);
  });

  it('adopts nothing when the vetted path is not the remembered one', async () => {
    const adopt = vi.fn();
    const stored = process.platform === 'win32' ? 'C:\\art' : '/art';
    const folders = loose<FolderGrants>({ vet: () => (process.platform === 'win32' ? 'C:\\elsewhere' : '/elsewhere'), adopt });
    const memory = loose<RememberedFolders>({ find: () => Promise.resolve(stored) });
    await expect(regrantFolder(folders, memory, 'p1', stored)).rejects.toThrow(/leads somewhere else/);
    expect(adopt).not.toHaveBeenCalled();
  });
});
