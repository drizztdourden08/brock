/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createSpriteStore } from '../src/sprites/create-sprite-store';
import { spriteBaseUrl } from '../src/sprites/sprite-base-url';
import { memoryFiles } from './fakes/memory-files';

const bytes = new Uint8Array([1, 2, 3]);
const first = { name: 'a.png', bytes };
const buffers = [first, { name: 'b.png', bytes }];
const stamp = { file: 'stamp.txt', parse: (text: string | null) => text?.trim() ?? null };
const store = createSpriteStore({ manifest: { expected: ['a.png', 'b.png'], stamp } });

describe('K3 sprite store', { tags: ['critical'] }, () => {
  it('names the folder after the rom without its extension', () => {
    expect(store.dir('game.sfc')).toBe('sprites/game');
    expect(spriteBaseUrl('game.smc')).toBe('app-sprite://sprites/game/');
  });

  it('checks as extracted after a write', async () => {
    const { files } = memoryFiles();
    expect(await store.check(files, 'game.sfc')).toEqual({ extracted: false, count: 0 });
    await store.write(files, 'game.sfc', buffers);
    expect(await store.check(files, 'game.sfc')).toEqual({ extracted: true, count: 2 });
    expect(await store.readFile(files, 'game.sfc', 'a.png')).toEqual(bytes);
  });

  it('lists the expected files that are absent', async () => {
    const { files, disk } = memoryFiles();
    await store.write(files, 'game.sfc', [first]);
    expect(await store.missing(files, 'game.sfc')).toEqual(['b.png']);
    disk.delete('sprites/game/extraction.json');
    expect(await store.check(files, 'game.sfc')).toEqual({ extracted: false, count: 1 });
  });

  it('is stale when files are partial or the stamp differs', async () => {
    const { files } = memoryFiles();
    expect(await store.isStale(files, 'game.sfc', '2')).toBe(false);
    await store.write(files, 'game.sfc', [first]);
    expect(await store.isStale(files, 'game.sfc', '2')).toBe(true);
    await store.write(files, 'game.sfc', buffers);
    await files.writeText('sprites/game/stamp.txt', '1');
    expect(await store.isStale(files, 'game.sfc', '2')).toBe(true);
    expect(await store.isStale(files, 'game.sfc', '1')).toBe(false);
  });

  it('removes the folder', async () => {
    const { files } = memoryFiles();
    await store.write(files, 'game.sfc', buffers);
    expect(await store.remove(files, 'game.sfc')).toEqual({ success: true });
    expect(await store.check(files, 'game.sfc')).toEqual({ extracted: false, count: 0 });
  });
});
