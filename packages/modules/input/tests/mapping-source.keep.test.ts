/* @layer electron-main @kind test */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { Sdl3Input } from '../src/main/sdl3.type';
import { createMappingDb } from '../src/main/mapping-db';
import { guidsOfFile } from '../src/mapping/mapping-sources';
import { parseMapping } from '../src/mapping/parse-mapping';
import { UNAVAILABLE_ADDON } from '../src/main/sdl3.constants';

const BUILTIN = '030000005e040000130b000001050000,Xbox Series Controller,a:b0,b:b1,platform:Windows,';
const BUNDLED = '03008fe54c050000e60c000000006800,PS5 Controller,a:b0,b:b1,x:b2,platform:Windows,';
const USER = '030000007e0500000920000000006800,Nintendo Switch Pro Controller,a:b0,platform:Windows,';
const EDITED = '030000005e040000130b000001050000,Edited Xbox,a:b0,b:b1,x:b2,platform:Windows,';
const OTHER_PLATFORM = '03000000790000001c18000000006800,USB Gamepad,a:b2,platform:Linux,';

const setup = async (userText: string | null) => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-mapping-'));
  const bundledPath = join(dir, 'gamecontrollerdb.txt');
  writeFileSync(bundledPath, `# header\n${BUNDLED}\n${OTHER_PLATFORM}\n`);
  const addon: Sdl3Input = {
    ...UNAVAILABLE_ADDON,
    addMapping: () => true,
    addMappingsFromFile: () => 1,
    mappingList: () => [BUILTIN, BUNDLED, USER, OTHER_PLATFORM],
  };
  const files = {
    exists: vi.fn(() => Promise.resolve(userText !== null)),
    readText: vi.fn(() => Promise.resolve(userText)),
    writeText: vi.fn(() => Promise.resolve()),
  } as Partial<MainContext['files']> as MainContext['files'];
  const paths = { data: (path: string) => path } as Partial<MainContext['paths']> as MainContext['paths'];
  const db = createMappingDb({ addon, files, paths, log: vi.fn(), bundledPath });
  await db.load();
  return db;
};

describe('the source of a mapping', () => {
  it('counts only bound inputs', () => {
    expect(parseMapping(BUILTIN)?.inputCount).toBe(2);
    expect(parseMapping('xinput,XInput,a:b0,crc:1234,hint:SDL_X:=1,type:xbox360,face:abxy,platform:Windows,')?.inputCount).toBe(1);
  });

  it('keeps the whole mapping string on the entry', () => {
    expect(parseMapping(`  ${BUILTIN}  `)?.mapping).toBe(BUILTIN);
  });

  it('reads the guids of a database file for one platform', () => {
    const text = `# comment\n${BUNDLED}\n${OTHER_PLATFORM}\n\njunk\n`;
    expect([...guidsOfFile(text, 'win32')]).toEqual(['03008fe54c050000e60c000000006800']);
    expect([...guidsOfFile(text, 'linux')]).toEqual(['03000000790000001c18000000006800']);
    expect(guidsOfFile(null, 'win32').size).toBe(0);
  });

  it.runIf(process.platform === 'win32')('marks a mapping as builtin, bundled or user', async () => {
    const db = await setup(`${USER}\n`);
    const byName = Object.fromEntries(db.list().map((entry) => [entry.name, entry.source]));
    expect(byName).toEqual({
      'Xbox Series Controller': 'builtin',
      'PS5 Controller': 'bundled',
      'Nintendo Switch Pro Controller': 'user',
      'USB Gamepad': 'builtin',
    });
  });

  it.runIf(process.platform === 'win32')('lets the user file win over the bundled one and marks a mapping added later', async () => {
    const db = await setup(`${BUNDLED}\n`);
    expect(db.list().find((entry) => entry.name === 'PS5 Controller')?.source).toBe('user');
    expect(await db.add(EDITED)).toBe(true);
    expect(db.list().find((entry) => entry.guid === '030000005e040000130b000001050000')?.source).toBe('user');
  });
});
