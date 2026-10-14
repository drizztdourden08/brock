/* @layer core @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSaveStore } from '../src/saves/create-save-store';
import { memoryFiles } from './fakes/memory-files';

const bytes = (...values: number[]): Uint8Array => new Uint8Array(values);
const DIR = 'profiles/p1/saves/normal';

const setup = () => {
  const { files, disk } = memoryFiles();
  return { disk, named: createSaveStore(files).named };
};

afterEach(() => {
  vi.useRealTimers();
});

describe('named saves: rename and overwrite', () => {
  it('renames a save and keeps its files', async () => {
    const { disk, named } = setup();
    const entry = await named.create('p1', 'normal', 'First', { bytes: bytes(1, 2) });
    const renamed = await named.rename('p1', 'normal', entry.id, '  Second  ');
    expect(renamed?.name).toBe('Second');
    expect((await named.list('p1', 'normal')).map((e) => e.name)).toEqual(['Second']);
    expect(disk.has(`${DIR}/${entry.id}.sav`)).toBe(true);
  });

  it('answers null for an unknown id and refuses an empty name', async () => {
    const { named } = setup();
    const entry = await named.create('p1', 'normal', 'First', { bytes: bytes(1) });
    expect(await named.rename('p1', 'normal', 'missing', 'x')).toBeNull();
    expect(await named.overwrite('p1', 'normal', 'missing', { bytes: bytes(1) })).toBeNull();
    await expect(named.rename('p1', 'normal', entry.id, '   ')).rejects.toThrow();
  });

  it('overwrites the bytes, the time and the screenshot under the same id', async () => {
    vi.useFakeTimers({ now: 1000 });
    const { disk, named } = setup();
    const entry = await named.create('p1', 'normal', 'Run', { bytes: bytes(1), screenshot: bytes(9), meta: { trigger: 'menu' } });
    vi.setSystemTime(5000);
    const next = await named.overwrite('p1', 'normal', entry.id, { bytes: bytes(2, 3) });
    expect(next).toEqual({ id: entry.id, name: 'Run', savedAt: 5000, hasScreenshot: false, meta: { trigger: 'menu' } });
    expect(Array.from(disk.get(`${DIR}/${entry.id}.sav`) ?? [])).toEqual([2, 3]);
    expect(disk.has(`${DIR}/${entry.id}.png`)).toBe(false);
  });
});

describe('named saves: prune and size', () => {
  const seed = async (named: ReturnType<typeof setup>['named'], times: number[]) => {
    const ids: string[] = [];
    for (const time of times) {
      vi.setSystemTime(time);
      ids.push((await named.create('p1', 'auto', `at ${time}`, { bytes: bytes(1, 2, 3) })).id);
    }
    return ids;
  };

  it('keeps the newest N', async () => {
    vi.useFakeTimers({ now: 0 });
    const { named } = setup();
    await seed(named, [100, 300, 200, 400]);
    const removed = await named.prune('p1', 'auto', { keep: 2 });
    expect(removed.map((e) => e.savedAt)).toEqual([200, 100]);
    expect((await named.list('p1', 'auto')).map((e) => e.savedAt).sort()).toEqual([300, 400]);
  });

  it('removes saves older than an age, and both rules at once', async () => {
    vi.useFakeTimers({ now: 0 });
    const { named } = setup();
    await seed(named, [100, 200, 300, 400]);
    expect((await named.prune('p1', 'auto', { maxAgeMs: 150, now: 400 })).map((e) => e.savedAt)).toEqual([200, 100]);
    expect((await named.prune('p1', 'auto', { keep: 1, maxAgeMs: 1000, now: 400 })).map((e) => e.savedAt)).toEqual([300]);
    await expect(named.prune('p1', 'auto', { keep: -1 })).rejects.toThrow();
  });

  it('sizes each save with its screenshot and skips one whose file is gone', async () => {
    const { disk, named } = setup();
    const kept = await named.create('p1', 'normal', 'A', { bytes: bytes(1, 2, 3), screenshot: bytes(4, 5) });
    const lost = await named.create('p1', 'normal', 'B', { bytes: bytes(1) });
    disk.delete(`${DIR}/${lost.id}.sav`);
    expect((await named.details('p1', 'normal')).map((e) => [e.id, e.bytes])).toEqual([[kept.id, 5]]);
    expect(await named.size('p1', 'normal')).toBe(5);
  });
});

describe('save companions', () => {
  it('removes the companion files when a slot is written or removed', async () => {
    const { files, disk } = memoryFiles();
    const store = createSaveStore(files, { companions: (profileId, ref) => [`profiles/${profileId}/extra/${ref.kind}.bin`] });
    disk.set('profiles/p1/extra/quick.bin', bytes(1));
    await store.slots.write('p1', { kind: 'quick', slot: 0 }, { bytes: bytes(1) });
    expect(disk.has('profiles/p1/extra/quick.bin')).toBe(false);
    const entry = await store.named.create('p1', 'normal', 'A', { bytes: bytes(1) });
    disk.set('profiles/p1/extra/normal.bin', bytes(1));
    await store.named.remove('p1', 'normal', entry.id);
    expect(disk.has('profiles/p1/extra/normal.bin')).toBe(false);
  });
});
