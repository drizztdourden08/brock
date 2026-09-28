/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createProfileStore } from '../src/storage/profiles/profile-store';
import { getAppState } from '../src/storage/get-app-state';
import type { FileStore } from '../src/platform/ports/file-store.type';

declare module '../src/augment' {
  interface ProfileExtension {
    romFile?: string;
    language?: string;
  }
  interface ProfilePatchExtension {
    romFile?: string;
    language?: string;
  }
}

const memoryFileStore = (): FileStore => {
  const files = new Map<string, string>();
  const children = (dir: string): string[] => {
    const prefix = `${dir}/`;
    const names = new Set<string>();
    for (const path of files.keys()) if (path.startsWith(prefix)) names.add(path.slice(prefix.length).split('/')[0] ?? '');
    return [...names];
  };
  const removeTree = (path: string): void => {
    for (const key of [...files.keys()]) if (key === path || key.startsWith(`${path}/`)) files.delete(key);
  };
  return {
    readBytes: () => Promise.resolve(null),
    readText: (path) => Promise.resolve(files.get(path) ?? null),
    writeBytes: () => Promise.resolve(),
    writeText: (path, data) => { files.set(path, data); return Promise.resolve(); },
    list: (dir) => Promise.resolve(children(dir)),
    remove: (path) => { removeTree(path); return Promise.resolve(); },
    exists: (path) => Promise.resolve(files.has(path) || children(path).length > 0),
    mkdir: () => Promise.resolve(),
    stat: () => Promise.resolve(null),
  };
};

describe('createProfileStore', () => {
  it('creates, lists, patches only the allowed keys and removes', async () => {
    const files = memoryFileStore();
    const store = createProfileStore(files, { build: () => ({ romFile: 'a.sfc' }), patchable: ['language'] });
    const created = await store.create({ name: 'One', initialConfig: { volume: 2 } });
    expect(created.romFile).toBe('a.sfc');
    expect(await store.readConfig(created.id)).toEqual({ volume: 2 });
    expect((await store.list()).map((p) => p.name)).toEqual(['One']);

    const patched = await store.update(created.id, { name: 'Uno', language: 'fr', romFile: 'b.sfc' });
    expect(patched?.name).toBe('Uno');
    expect(patched?.language).toBe('fr');
    expect(patched?.romFile).toBe('a.sfc');

    await store.setLast(created.id);
    expect((await getAppState(files)).lastProfileId).toBe(created.id);
    await store.remove(created.id);
    expect(await store.list()).toEqual([]);
    expect((await getAppState(files)).lastProfileId).toBeNull();
  });

  it('refuses an unsafe profile id', async () => {
    const store = createProfileStore(memoryFileStore());
    await expect(store.load('../etc')).rejects.toThrow('Unsafe profile id');
  });
});
