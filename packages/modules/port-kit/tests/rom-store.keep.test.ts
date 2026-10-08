/* @layer core @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import type { PortDefinition } from '../src/port/port-definition.type';
import { createRomStore } from '../src/rom/create-rom-store';
import { memoryFiles } from './fakes/memory-files';
import { testPort } from './fakes/test-port';

const sha1 = (bytes: Uint8Array): string => createHash('sha1').update(bytes).digest('hex').toUpperCase();

const dump = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
const headered = new Uint8Array([0xff, 0xff, ...dump]);
const ORIGINAL = 'Legend of Game, The (USA) [!].smc';

const portWith = (keepFileName?: boolean): PortDefinition => testPort({
  extensions: ['.sfc', '.smc'],
  known: { [sha1(dump)]: { id: 'us', label: 'US' } },
  normalize: (bytes: Uint8Array) => (bytes.length === dump.length + 2 ? bytes.subarray(2) : bytes),
  ...(keepFileName === undefined ? {} : { keepFileName }),
});

describe('createRomStore file names', () => {
  it('stores a ROM under its identity id by default', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith());
    const result = await store.importRom(ORIGINAL, headered);
    expect(result.file).toBe('us.sfc');
    expect(Array.from(disk.get('roms/us.sfc') ?? [])).toEqual(Array.from(dump));
    expect(store.assetFileOf('us.sfc')).toBe('assets/us.dat');
  });

  it('keeps the original file name with keepFileName', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith(true));
    const result = await store.importRom(`C:\\roms\\${ORIGINAL}`, headered);
    expect(result.file).toBe(ORIGINAL);
    expect(disk.has(`roms/${ORIGINAL}`)).toBe(true);
    expect(store.assetFileOf(ORIGINAL)).toBe('assets/Legend of Game, The (USA) [!].dat');
  });

  it('lists a kept name by its hash and skips unknown files', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith(true));
    await store.importRom(ORIGINAL, headered);
    disk.set('roms/Other (EU).sfc', new Uint8Array([9, 9]));
    disk.set('roms/notes.txt', new Uint8Array([1]));
    disk.set('assets/Legend of Game, The (USA) [!].dat', new Uint8Array([1]));
    const listed = await store.list();
    expect(listed).toEqual([{ file: ORIGINAL, identity: { id: 'us', label: 'US' }, hasAssets: true }]);
  });

  it('reads and removes a kept name with its asset blob', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith(true));
    await store.importRom(ORIGINAL, headered);
    disk.set('assets/Legend of Game, The (USA) [!].dat', new Uint8Array([1]));
    expect((await store.read(ORIGINAL))?.ok).toBe(true);
    await store.remove(ORIGINAL);
    expect([...disk.keys()]).toEqual([]);
  });

  it('refuses a kept name that is unsafe on disk', async () => {
    const store = createRomStore(memoryFiles().files, portWith(true));
    await expect(store.importRom('CON.sfc', dump)).rejects.toThrow();
    await expect(store.read('../escape.sfc')).rejects.toThrow();
    await expect(store.read('.hidden.sfc')).rejects.toThrow();
  });
});
