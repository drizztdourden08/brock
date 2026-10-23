/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { MappingDbInput } from '../src/main/mapping-db.type';
import type { Sdl3Input } from '../src/main/sdl3.type';
import { decodeGuid } from '../src/mapping/decode-guid';
import { parseMapping } from '../src/mapping/parse-mapping';
import { parseMappings } from '../src/mapping/parse-mappings';
import { createMappingDb } from '../src/main/mapping-db';
import { UNAVAILABLE_ADDON } from '../src/main/sdl3.constants';

const XBOX = '030000005e040000130b000001050000,Xbox Series Controller,a:b0,b:b1,x:b2,y:b3,platform:Windows,';
const PLAYSTATION = '03008fe54c050000e60c000000006800,PS5 Controller,a:b0,b:b1,x:b2,y:b3,platform:Windows,';
const SWITCH = '030000007e0500000920000000006800,Nintendo Switch Pro Controller,a:b0,b:b1,platform:Linux,';
const GENERIC = '03000000790000001c18000000006800,USB Gamepad,a:b2,b:b1,x:b3,y:b0,platform:Mac OS X,';
const NAMED = '00006a1c48656c6c6f20706164000000,Hello pad,a:b0,b:b1,';

const mappingDb = (addon: Partial<Sdl3Input>) => {
  const input: MappingDbInput = {
    addon: { ...UNAVAILABLE_ADDON, ...addon },
    files: { exists: vi.fn(), readText: vi.fn(), writeText: vi.fn() } as Partial<MainContext['files']> as MainContext['files'],
    paths: { data: vi.fn() } as Partial<MainContext['paths']> as MainContext['paths'],
    log: vi.fn(),
    bundledPath: undefined,
  };
  return createMappingDb(input);
};

describe('decoding an SDL GUID', () => {
  it('reads vendor and product from the little endian words', () => {
    expect(decodeGuid('030000005e040000130b000001050000')).toEqual({ vid: 0x045e, pid: 0x0b13 });
    expect(decodeGuid('030000007e0500000920000000006800')).toEqual({ vid: 0x057e, pid: 0x2009 });
  });

  it('skips the crc field when it is set', () => {
    expect(decodeGuid('03008fe54c050000e60c000000006800')).toEqual({ vid: 0x054c, pid: 0x0ce6 });
  });

  it('gives zero ids to a GUID that carries a name instead of ids', () => {
    expect(decodeGuid('00006a1c48656c6c6f20706164000000')).toEqual({ vid: 0, pid: 0 });
  });

  it('gives zero ids to the xinput pseudo GUID and to a short one', () => {
    expect(decodeGuid('xinput')).toEqual({ vid: 0, pid: 0 });
    expect(decodeGuid('0300')).toEqual({ vid: 0, pid: 0 });
  });
});

describe('parsing a mapping string', () => {
  it('parses an Xbox pad with its platform and family', () => {
    expect(parseMapping(XBOX)).toEqual({
      guid: '030000005e040000130b000001050000', name: 'Xbox Series Controller', vid: 0x045e, pid: 0x0b13, platform: 'Windows', family: 'xbox',
    });
  });

  it('parses a PlayStation pad', () => {
    expect(parseMapping(PLAYSTATION)).toMatchObject({ vid: 0x054c, pid: 0x0ce6, family: 'playstation', platform: 'Windows' });
  });

  it('parses a Switch pad and keeps a platform with a space', () => {
    expect(parseMapping(SWITCH)).toMatchObject({ vid: 0x057e, pid: 0x2009, family: 'nintendo', platform: 'Linux' });
    expect(parseMapping(GENERIC)?.platform).toBe('Mac OS X');
  });

  it('leaves family off for a generic pad', () => {
    const entry = parseMapping(GENERIC);
    expect(entry).toMatchObject({ vid: 0x0079, pid: 0x181c, name: 'USB Gamepad' });
    expect(entry).not.toHaveProperty('family');
  });

  it('falls back to the name for the family when the ids are unknown', () => {
    expect(parseMapping('xinput,XInput Controller,a:b0,')).toMatchObject({ vid: 0, pid: 0, family: 'xbox' });
    expect(parseMapping(NAMED)).toMatchObject({ vid: 0, pid: 0 });
    expect(parseMapping(NAMED)).not.toHaveProperty('platform');
  });

  it('lowercases the guid and rejects lines with no name or bindings', () => {
    expect(parseMapping(XBOX.toUpperCase())?.guid).toBe('030000005e040000130b000001050000');
    expect(parseMapping('')).toBeNull();
    expect(parseMapping('030000005e040000130b000001050000,')).toBeNull();
    expect(parseMapping('030000005e040000130b000001050000,Name')).toBeNull();
  });

  it('keeps one entry per guid and platform, the last one winning', () => {
    const renamed = XBOX.replace('Xbox Series Controller', 'Renamed');
    const linux = XBOX.replace('Windows', 'Linux');
    const entries = parseMappings([XBOX, renamed, linux, 'junk']);
    expect(entries.map((entry) => `${entry.name}|${entry.platform}`)).toEqual(['Renamed|Windows', 'Xbox Series Controller|Linux']);
  });
});

describe('the mapping list in main', () => {
  it('returns an empty list with an addon that lacks mappingList', () => {
    expect(mappingDb({}).list()).toEqual([]);
  });

  it('parses once and caches until a mapping is added', async () => {
    const mappingList = vi.fn(() => [XBOX, GENERIC]);
    const db = mappingDb({ mappingList, addMapping: () => true });
    expect(db.list()).toHaveLength(2);
    expect(db.list()).toHaveLength(2);
    expect(mappingList).toHaveBeenCalledTimes(1);
    expect(await db.add(SWITCH)).toBe(true);
    db.list();
    expect(mappingList).toHaveBeenCalledTimes(2);
  });

  it('does not cache an empty answer', () => {
    const mappingList = vi.fn<() => string[]>().mockReturnValueOnce([]).mockReturnValue([XBOX]);
    const db = mappingDb({ mappingList });
    expect(db.list()).toEqual([]);
    expect(db.list()).toHaveLength(1);
  });
});
