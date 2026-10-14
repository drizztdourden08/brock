/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { PortDefinition } from '../src/port/port-definition.type';
import type { RomDefinition } from '../src/rom/rom.type';
import { createRomStore } from '../src/rom/create-rom-store';
import { memoryFiles } from './fakes/memory-files';
import { sha1Of } from './fakes/sha1-of';
import { testPort } from './fakes/test-port';
import { zipOf } from './fakes/zip-of';

const dump = new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]);
const other = new Uint8Array([1, 1, 2, 3, 5, 8, 13, 21]);
const second = new Uint8Array([4, 4, 4, 4]);

const portWith = (rom: Partial<RomDefinition> = {}): PortDefinition => testPort({
  extensions: ['.sfc', '.smc'],
  known: { [sha1Of(dump)]: { id: 'us', label: 'US' } },
  ...rom,
});

describe('createRomStore unknown dumps', () => {
  it('refuses an unknown dump by default', async () => {
    const store = createRomStore(memoryFiles().files, portWith());
    expect(await store.importRom('mine.sfc', other)).toMatchObject({ ok: false, reason: 'unknown', hash: sha1Of(other) });
  });

  it('stores an unknown dump under its hash and flags it', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith({ acceptUnknown: true }));
    const hash = sha1Of(other).toLowerCase();
    const result = await store.importRom('My Hack.sfc', other);
    expect(result).toMatchObject({ ok: true, file: `${hash}.sfc`, existed: false });
    expect(result.ok && result.rom).toMatchObject({ unknown: true, hash: sha1Of(other), identity: { id: hash, label: 'My Hack' } });
    expect(disk.has(`roms/${hash}.sfc`)).toBe(true);
    await store.importRom('us.sfc', dump);
    expect(await store.list()).toEqual([
      { file: `${hash}.sfc`, identity: { id: hash, label: hash }, unknown: true, hash: sha1Of(other), hasAssets: false },
      { file: 'us.sfc', identity: { id: 'us', label: 'US' }, hasAssets: false },
    ]);
  });

  it('keeps the original name of an unknown dump with keepFileName', async () => {
    const store = createRomStore(memoryFiles().files, portWith({ acceptUnknown: true, keepFileName: true }));
    await store.importRom('My Hack.sfc', other);
    expect(await store.list()).toEqual([
      { file: 'My Hack.sfc', identity: { id: sha1Of(other).toLowerCase(), label: 'My Hack' }, unknown: true, hash: sha1Of(other), hasAssets: false },
    ]);
  });

  it('refuses a dump over maxBytes', async () => {
    const store = createRomStore(memoryFiles().files, portWith({ maxBytes: 4 }));
    expect(await store.importRom('us.sfc', dump)).toMatchObject({ ok: false, reason: 'size' });
  });
});

describe('createRomStore zip input', () => {
  it('picks the one ROM inside a zip, deflated or stored', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith());
    const zipped = zipOf([{ name: 'readme.txt', data: new Uint8Array([1]) }, { name: 'folder/Game.sfc', data: dump }]);
    expect(await store.importRom('Game.zip', zipped)).toMatchObject({ ok: true, file: 'us.sfc' });
    expect(Array.from(disk.get('roms/us.sfc') ?? [])).toEqual(Array.from(dump));
    const stored = zipOf([{ name: 'Game.smc', data: dump, stored: true }]);
    expect(await store.importRom('Game.zip', stored)).toMatchObject({ ok: true, existed: true });
  });

  it('picks the known ROM among several, and refuses a zip it cannot choose from', async () => {
    const store = createRomStore(memoryFiles().files, portWith({ acceptUnknown: true }));
    expect(await store.importRom('a.zip', zipOf([{ name: 'b.sfc', data: other }, { name: 'a.sfc', data: dump }]))).toMatchObject({ ok: true, file: 'us.sfc' });
    expect(await store.importRom('b.zip', zipOf([{ name: 'b.sfc', data: other }, { name: 'c.sfc', data: second }]))).toMatchObject({ ok: false, reason: 'archive' });
    expect(await store.importRom('c.zip', zipOf([{ name: 'notes.txt', data: dump }]))).toMatchObject({ ok: false, reason: 'archive' });
    expect(await store.importRom('d.zip', new Uint8Array([0x50, 0x4b, 3, 4, 0, 0]))).toMatchObject({ ok: false, reason: 'archive' });
  });

  it('takes a lone unknown dump only with acceptUnknown, and lists what a refused zip held', async () => {
    const zipped = zipOf([{ name: 'readme.txt', data: dump }, { name: 'Hack.sfc', data: other }]);
    const strict = createRomStore(memoryFiles().files, portWith());
    expect(await strict.importRom('h.zip', zipped)).toEqual({
      ok: false, hash: '', reason: 'archive', message: 'The zip holds no single dump to import: readme.txt (not a ROM file), Hack.sfc (unknown dump).',
    });
    const open = createRomStore(memoryFiles().files, portWith({ acceptUnknown: true }));
    expect(await open.importRom('h.zip', zipped)).toMatchObject({ ok: true, rom: { unknown: true, identity: { label: 'Hack' } } });
    expect(await strict.importRom('e.zip', zipOf([]))).toMatchObject({ reason: 'archive', message: 'The zip holds no files.' });
    const small = createRomStore(memoryFiles().files, portWith({ maxBytes: 4 }));
    expect(await small.importRom('s.zip', zipOf([{ name: 'a.sfc', data: dump }]))).toMatchObject({ message: 'The zip holds no single dump to import: a.sfc (too large).' });
  });
});

describe('createRomStore kinds and removal', () => {
  const kinds = (): RomDefinition['kinds'] => ({
    extra: {
      label: 'Second cartridge', extensions: ['.gba'], known: { [sha1Of(second)]: { id: 'second', label: 'Second' } }, dir: 'roms/extra',
      derived: async (file, files) => (await files.list('assets')).filter((name) => name.endsWith(`.${file}.dat`)).map((name) => `assets/${name}`),
    },
  });

  it('keeps each kind to its own known list, extensions and folder', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith({ kinds: kinds() }));
    expect(store.kinds()).toEqual(['main', 'extra']);
    expect(await store.of('extra').importRom('x.gba', second)).toMatchObject({ ok: true, file: 'second.gba' });
    expect(disk.has('roms/extra/second.gba')).toBe(true);
    expect(await store.of('extra').importRom('us.gba', dump)).toMatchObject({ ok: false, reason: 'unknown' });
    expect(await store.importRom('x.gba', second)).toMatchObject({ ok: false, reason: 'extension' });
    expect(() => store.of('missing')).toThrow();
    expect(() => createRomStore(files, portWith({ kinds: { main: { extensions: ['.x'], known: {} } } }))).toThrow();
  });

  it('removes the asset blob and the derived files with the ROM', async () => {
    const { files, disk } = memoryFiles();
    const store = createRomStore(files, portWith({ kinds: kinds(), derived: () => ['profiles/p1/cache.bin'] }));
    await store.importRom('us.sfc', dump);
    await store.of('extra').importRom('x.gba', second);
    disk.set('assets/us.dat', new Uint8Array([1]));
    disk.set('assets/us.second.gba.dat', new Uint8Array([1]));
    disk.set('profiles/p1/cache.bin', new Uint8Array([1]));
    expect(await store.of('extra').remove('second.gba')).toEqual(['roms/extra/second.gba', 'assets/us.second.gba.dat']);
    expect(await store.remove('us.sfc')).toEqual(['roms/us.sfc', 'assets/us.dat', 'profiles/p1/cache.bin']);
    expect([...disk.keys()]).toEqual([]);
  });
});
