/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { decodeSaveSlot } from '../src/saves/decode-save-slot';
import { encodeSaveSlot } from '../src/saves/encode-save-slot';
import { quickSlotOf } from '../src/saves/quick-slot-of';
import { saveSlotPaths } from '../src/saves/save-slot-paths';

const state = new Uint8Array([10, 20, 30, 40, 50]);
const meta = { port: 'demo', savedAt: 1700000000000, rom: 'us.sfc' };

describe('saveSlotPaths', () => {
  it('names a quick slot save<N> under saves/quick', () => {
    expect(saveSlotPaths('p1', { kind: 'quick', slot: 3 })).toEqual({
      state: 'profiles/p1/saves/quick/save3.sav',
      screenshot: 'profiles/p1/saves/quick/save3.png',
    });
  });

  it('names a manual save by its id under saves/normal', () => {
    expect(saveSlotPaths('p1', { kind: 'normal', id: 'ab12cd34' }).state).toBe('profiles/p1/saves/normal/ab12cd34.sav');
  });

  it('refuses a negative or fractional quick slot', () => {
    expect(() => saveSlotPaths('p1', { kind: 'quick', slot: -1 })).toThrow();
    expect(() => saveSlotPaths('p1', { kind: 'quick', slot: 1.5 })).toThrow();
  });

  it('refuses an id that would leave the folder', () => {
    expect(() => saveSlotPaths('p1', { kind: 'auto', id: '../x' })).toThrow();
  });
});

describe('quickSlotOf', () => {
  it('reads the slot number back from a file name', () => {
    expect(quickSlotOf('save11.sav')).toBe(11);
    expect(quickSlotOf('save2.png')).toBeNull();
    expect(quickSlotOf('manifest.json')).toBeNull();
  });
});

describe('save slot container', () => {
  it('round-trips the metadata and the state bytes', () => {
    const decoded = decodeSaveSlot(encodeSaveSlot({ meta, state }), 'demo');
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.record.meta).toEqual(meta);
      expect(Array.from(decoded.record.state)).toEqual(Array.from(state));
    }
  });

  it('refuses a save that belongs to another port', () => {
    const decoded = decodeSaveSlot(encodeSaveSlot({ meta, state }), 'other');
    expect(decoded.ok ? null : decoded.reason).toBe('port');
  });

  it('reports a container as pksv', () => {
    const decoded = decodeSaveSlot(encodeSaveSlot({ meta, state }), 'demo');
    expect(decoded.ok && decoded.format).toBe('pksv');
  });

  it('reads raw state bytes with no header as a raw state', () => {
    const raw = new TextEncoder().encode('#!s9xsnp:0011\nNAM:000020:us.sfc\n');
    const decoded = decodeSaveSlot(raw, 'demo');
    expect(decoded.ok && decoded.format).toBe('raw');
    if (decoded.ok) {
      expect(decoded.record.meta.port).toBe('demo');
      expect(Array.from(decoded.record.state)).toEqual(Array.from(raw));
    }
  });

  it('refuses raw state bytes when raw is turned off', () => {
    const decoded = decodeSaveSlot(state, 'demo', { acceptRaw: false });
    expect(decoded.ok ? null : decoded.reason).toBe('magic');
  });

  it('refuses an empty file', () => {
    const decoded = decodeSaveSlot(new Uint8Array(0), 'demo');
    expect(decoded.ok ? null : decoded.reason).toBe('magic');
  });

  it('refuses a container cut inside its header', () => {
    const decoded = decodeSaveSlot(encodeSaveSlot({ meta, state }).subarray(0, 6), 'demo');
    expect(decoded.ok ? null : decoded.reason).toBe('corrupt');
  });

  it('refuses a header whose metadata runs past the end', () => {
    const bytes = encodeSaveSlot({ meta, state });
    const decoded = decodeSaveSlot(bytes.subarray(0, 12), 'demo');
    expect(decoded.ok ? null : decoded.reason).toBe('corrupt');
  });

  it('refuses an unknown container version', () => {
    const bytes = encodeSaveSlot({ meta, state });
    bytes[4] = 99;
    const decoded = decodeSaveSlot(bytes, 'demo');
    expect(decoded.ok ? null : decoded.reason).toBe('version');
  });
});
