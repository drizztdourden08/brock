/* @layer electron-main @kind test */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { readBridgeDiscovery, writeBridgeDiscovery } from '../src/bridge';
import type { SystemToolRun } from '../src/main/bridge/bridge.type';
import { windowsAccessProblem } from '../src/main/bridge/windows-access-problem';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';

afterEach(closeOpened);

const ME = 'S-1-5-21-1-2-3-1001';
const OTHER = 'S-1-5-21-1-2-3-1004';
const FULL = (sid: string): string => `(A;ID;FA;;;${sid})`;

const fakeTools = (sddl: string): SystemToolRun => (exe) =>
  Buffer.from(exe === 'whoami.exe' ? `"pc\\me","${ME}"\r\n` : `${sddl}\r\n`, 'latin1');

const privateTo = (sddl: string): boolean => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, '{}');
  return windowsAccessProblem(file, fakeTools(sddl)) === null;
};

describe('the Windows access check on the discovery file', () => {
  it('trusts the user, SYSTEM and Administrators as owner and as access entries', () => {
    expect(privateTo(`O:${ME}G:${ME}D:P(A;;FA;;;${ME})`)).toBe(true);
    expect(privateTo(`O:BAG:S-1-5-21-1-2-3-513D:AI${FULL('SY')}${FULL('BA')}${FULL(ME)}`)).toBe(true);
    expect(privateTo(`O:S-1-5-32-544G:SYD:P${FULL('S-1-5-18')}${FULL('S-1-5-32-544')}${FULL(ME)}`)).toBe(true);
    expect(privateTo(`O:SYD:P${FULL(ME)}(D;;FA;;;WD)`)).toBe(true);
  });

  it('refuses any other owner or access entry', () => {
    expect(privateTo(`O:${OTHER}D:P${FULL(ME)}`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(ME)}(A;ID;0x1200a9;;;BU)`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(ME)}(A;ID;0x1200a9;;;S-1-5-32-545)`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(ME)}(A;ID;0x1200a9;;;AU)`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(ME)}(A;ID;0x1200a9;;;S-1-5-11)`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(ME)}${FULL('WD')}`)).toBe(false);
    expect(privateTo(`O:${ME}D:P${FULL(OTHER)}`)).toBe(false);
    expect(privateTo(`O:${ME}D:NO_ACCESS_CONTROL`)).toBe(false);
    expect(privateTo('')).toBe(false);
  });

  it('names the owner and each unexpected entry it found, and why it could not read them', () => {
    const file = join(tempDir(), 'bridge.json');
    writeFileSync(file, '{}');
    expect(windowsAccessProblem(file, fakeTools(`O:${OTHER}D:P${FULL(ME)}(A;ID;0x1200a9;;;S-1-15-2-1)(OA;;CC;;;AU)`))).toBe(
      `owner ${OTHER} (not trusted); access list flags "P"; unexpected entries: S-1-15-2-1 0x1200a9, OA AU CC; you are ${ME}`,
    );
    const broken: SystemToolRun = (exe) => {
      if (exe === 'whoami.exe') return Buffer.from(`"me","${ME}"`, 'latin1');
      throw new Error('powershell.exe exited with 1: Get-Acl failed');
    };
    expect(windowsAccessProblem(file, broken)).toBe('could not read its owner and access list: powershell.exe exited with 1: Get-Acl failed');
  });

  it.runIf(process.platform === 'win32')('reads a real file in a folder with a non-ASCII name', async () => {
    const { server } = await serve();
    const folder = join(tempDir(), 'dossier-été');
    mkdirSync(folder);
    const file = join(folder, 'bridge.json');
    writeBridgeDiscovery(file, discoveryOf(server));
    expect(readBridgeDiscovery(file).endpoint).toBe(server.endpoint);
    const open = join(folder, 'open.json');
    writeOpenFile(open, JSON.stringify(discoveryOf(server)));
    expect(windowsAccessProblem(open)).toMatch(/unexpected entries: (?:.*[ ,])?(?:BU|S-1-5-32-545) /);
  });
});
