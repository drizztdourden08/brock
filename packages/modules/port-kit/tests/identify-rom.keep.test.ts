/* @layer core @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { hasRomExtension } from '../src/rom/has-rom-extension';
import { identifyRom } from '../src/rom/identify-rom';
import type { RomDefinition } from '../src/rom/rom.type';

const sha1 = (bytes: Uint8Array): string => createHash('sha1').update(bytes).digest('hex').toUpperCase();

const dump = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
const header = new Uint8Array(4).fill(0xff);
const withHeader = new Uint8Array([...header, ...dump]);

const definition: RomDefinition = {
  extensions: ['.rom', '.bin'],
  known: { [sha1(dump)]: { id: 'test', label: 'Test dump' } },
  normalize: (bytes) => (bytes.length === dump.length + header.length ? bytes.subarray(header.length) : bytes),
};

describe('identifyRom', () => {
  it('accepts a dump whose SHA-1 is declared', async () => {
    const check = await identifyRom(dump, definition);
    expect(check.ok).toBe(true);
    if (check.ok) {
      expect(check.rom.identity.id).toBe('test');
      expect(check.rom.hash).toBe(sha1(dump));
    }
  });

  it('hashes the normalized bytes, so a headered copy matches', async () => {
    const check = await identifyRom(withHeader, definition);
    expect(check.ok).toBe(true);
    if (check.ok) expect(Array.from(check.rom.bytes)).toEqual(Array.from(dump));
  });

  it('refuses an unknown dump and reports its hash', async () => {
    const other = new Uint8Array([9, 9, 9]);
    const check = await identifyRom(other, definition);
    expect(check).toEqual({ ok: false, hash: sha1(other), reason: 'unknown' });
  });

  it('matches a declared hash written in lower case', async () => {
    const lower: RomDefinition = { extensions: ['.rom'], known: { [sha1(dump).toLowerCase()]: { id: 'low', label: 'Lower' } } };
    const check = await identifyRom(dump, lower);
    expect(check.ok && check.rom.identity.id).toBe('low');
  });
});

describe('hasRomExtension', () => {
  it('checks the extension without regard to case', () => {
    expect(hasRomExtension('Game (USA).ROM', definition)).toBe(true);
    expect(hasRomExtension('game.bin', definition)).toBe(true);
    expect(hasRomExtension('game.zip', definition)).toBe(false);
  });
});
