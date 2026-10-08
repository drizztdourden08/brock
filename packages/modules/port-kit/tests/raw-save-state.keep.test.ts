/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { createSaveSlots } from '../src/renderer/saves/create-save-slots';
import { createSaveStore } from '../src/saves/create-save-store';
import { decodeSaveSlot } from '../src/saves/decode-save-slot';
import { fakeCore } from './fakes/fake-core';
import { memoryFiles } from './fakes/memory-files';
import { testPort } from './fakes/test-port';

const RAW_STATE = new TextEncoder().encode('#!s9xsnp:0011\nNAM:000020:Game (USA).sfc\nCPU:000004:abcd');
const CORE_STATE = new Uint8Array([7, 7, 7, 7]);
const QUICK = 'profiles/p1/saves/quick/save0.sav';

const setup = () => {
  const { core, loaded } = fakeCore(testPort({ extensions: ['.sfc'], known: {} }), CORE_STATE);
  const { files, disk } = memoryFiles();
  const saves = createSaveSlots({ core, store: createSaveStore(files), profileId: 'p1', rom: 'us.sfc' });
  return { saves, loaded, disk };
};

describe('raw save states', () => {
  it('loads a raw state file with no container into the core', async () => {
    const { saves, loaded, disk } = setup();
    disk.set(QUICK, RAW_STATE);
    expect(await saves.load({ kind: 'quick', slot: 0 })).toBe(true);
    expect(Array.from(loaded[0] ?? [])).toEqual(Array.from(RAW_STATE));
  });

  it('loads a raw named fixture listed in the manifest', async () => {
    const { saves, loaded, disk } = setup();
    const manifest = [{ id: 'fx01', name: 'Boss door', savedAt: 1, hasScreenshot: false }];
    disk.set('profiles/p1/saves/normal/manifest.json', new TextEncoder().encode(JSON.stringify(manifest)));
    disk.set('profiles/p1/saves/normal/fx01.sav', RAW_STATE);
    expect(await saves.loadNamed('normal', 'boss door')).toBe(true);
    expect(loaded).toHaveLength(1);
  });

  it('loads raw state bytes handed in directly', () => {
    const { saves, loaded } = setup();
    expect(saves.loadStateBytes(RAW_STATE)).toBe(true);
    expect(loaded).toHaveLength(1);
  });

  it('still writes a PKSV container when it saves', async () => {
    const { saves, disk } = setup();
    expect(await saves.save({ kind: 'quick', slot: 0 })).toBe(true);
    const written = disk.get(QUICK) ?? new Uint8Array(0);
    expect(new TextDecoder().decode(written.subarray(0, 4))).toBe('PKSV');
    const decoded = decodeSaveSlot(written, 'demo');
    expect(decoded.ok && decoded.format).toBe('pksv');
    if (decoded.ok) expect(Array.from(decoded.record.state)).toEqual(Array.from(CORE_STATE));
  });
});
