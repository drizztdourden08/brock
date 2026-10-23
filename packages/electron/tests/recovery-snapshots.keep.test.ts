/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, readdir, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createRecoverySnapshots } from '../src/main/documents/recovery-snapshots';

let dir = '';
let tick = 0;

const setup = () => createRecoverySnapshots({ profileDir: (id) => join(dir, 'profiles', id), now: () => ++tick });
const bytes = (...values: number[]): Uint8Array => new Uint8Array(values);

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'brock-recovery-'));
  tick = 0;
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('recovery snapshots', () => {
  it('stores a snapshot in the profile folder and lists it with its facts', async () => {
    const snapshots = setup();
    await snapshots.save('p1', 'doc-1', bytes(1, 2, 3), { name: 'sprite.bxel', path: join(dir, 'sprite.bxel') });
    expect(await snapshots.list('p1')).toEqual([
      { key: 'doc-1', name: 'sprite.bxel', path: join(dir, 'sprite.bxel'), savedAt: 1, size: 3 },
    ]);
    expect([...(await snapshots.read('p1', 'doc-1') ?? [])]).toEqual([1, 2, 3]);
    expect(await readdir(join(dir, 'profiles', 'p1', 'recovery'))).toHaveLength(2);
  });

  it('replaces the snapshot of a key and lists the newest first', async () => {
    const snapshots = setup();
    await snapshots.save('p1', 'a', bytes(1), {});
    await snapshots.save('p1', 'b', bytes(2), {});
    await snapshots.save('p1', 'a', bytes(9, 9), {});
    const listed = await snapshots.list('p1');
    expect(listed.map((entry) => entry.key)).toEqual(['a', 'b']);
    expect(listed[0]).toMatchObject({ size: 2, name: null, path: null });
    expect([...(await snapshots.read('p1', 'a') ?? [])]).toEqual([9, 9]);
  });

  it('keeps a list per profile', async () => {
    const snapshots = setup();
    await snapshots.save('p1', 'a', bytes(1), {});
    expect(await snapshots.list('p2')).toEqual([]);
    expect(await snapshots.read('p2', 'a')).toBeNull();
  });

  it('discards one snapshot, data and record', async () => {
    const snapshots = setup();
    await snapshots.save('p1', 'a', bytes(1), {});
    await snapshots.save('p1', 'b', bytes(2), {});
    await snapshots.discard('p1', 'a');
    expect((await snapshots.list('p1')).map((entry) => entry.key)).toEqual(['b']);
    expect(await snapshots.read('p1', 'a')).toBeNull();
    await expect(snapshots.discard('p1', 'a')).resolves.toBeUndefined();
  });

  it('discards the snapshots of a document once that path is saved', async () => {
    const snapshots = setup();
    const saved = join(dir, 'saved.bxel');
    await snapshots.save('p1', 'a', bytes(1), { path: saved });
    await snapshots.save('p1', 'b', bytes(2), { path: join(dir, 'other.bxel') });
    await snapshots.save('p1', 'c', bytes(3), {});
    await snapshots.discardForPath('p1', saved);
    expect((await snapshots.list('p1')).map((entry) => entry.key).sort()).toEqual(['b', 'c']);
  });

  it('skips a record whose data is missing and a record that is damaged', async () => {
    const snapshots = setup();
    await snapshots.save('p1', 'a', bytes(1), {});
    await snapshots.save('p1', 'b', bytes(2), {});
    const folder = join(dir, 'profiles', 'p1', 'recovery');
    await rm(join(folder, 'a.snapshot'));
    await writeFile(join(folder, 'c.json'), '{broken');
    expect((await snapshots.list('p1')).map((entry) => entry.key)).toEqual(['b']);
  });

  it('refuses a key that could leave the folder', async () => {
    const snapshots = setup();
    await expect(snapshots.save('p1', '../escape', bytes(1), {})).rejects.toThrow(/Unsafe snapshot key/);
    await expect(snapshots.read('p1', 'a/b')).rejects.toThrow(/Unsafe snapshot key/);
  });
});
