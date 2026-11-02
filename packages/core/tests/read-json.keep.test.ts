/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FileStore } from '../src/platform/ports/file-store.type';
import { readJson } from '../src/storage/read-json';

const textStore = (initial: Record<string, string>): { files: FileStore; disk: Map<string, string> } => {
  const disk = new Map(Object.entries(initial));
  const files = {
    readText: (path: string) => Promise.resolve(disk.get(path) ?? null),
    writeText: (path: string, data: string) => Promise.resolve(void disk.set(path, data)),
    remove: (path: string) => Promise.resolve(void disk.delete(path)),
  } as Partial<FileStore> as FileStore;
  return { files, disk };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('K5 readJson on broken text', { tags: ['critical'] }, () => {
  it('returns the fallback, logs once and keeps the bad text beside the path', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { files, disk } = textStore({ 'config.json': '{"theme": "da' });
    expect(await readJson(files, 'config.json', { theme: 'light' })).toEqual({ theme: 'light' });
    expect(logged).toHaveBeenCalledTimes(1);
    expect(String(logged.mock.calls[0]?.[0])).toContain('config.json');
    expect(disk.has('config.json')).toBe(false);
    const kept = [...disk.entries()].filter(([name]) => name.startsWith('config.json.corrupt-'));
    expect(kept.map(([, text]) => text)).toEqual(['{"theme": "da']);
  });

  it('stays quiet for a missing file and for good JSON', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { files, disk } = textStore({ 'good.json': '﻿{"a":1}' });
    expect(await readJson(files, 'missing.json', 7)).toBe(7);
    expect(await readJson(files, 'good.json', null)).toEqual({ a: 1 });
    expect(logged).not.toHaveBeenCalled();
    expect([...disk.keys()]).toEqual(['good.json']);
  });
});
