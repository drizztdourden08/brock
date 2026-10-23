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
const BUILTIN_ADMIN = 'S-1-5-21-3776380004-1005456608-3524014338-500';
const OTHER = 'S-1-5-21-1-2-3-1004';
const FULL = (sid: string): string => `E Allow ${sid} FullControl`;

const fakeTools = (lines: readonly string[], me = ME): SystemToolRun => (exe) =>
  Buffer.from(exe === 'whoami.exe' ? `"pc\\me","${me}"\r\n` : `${lines.join('\r\n')}\r\n`, 'latin1');

const problemOf = (lines: readonly string[], me = ME): string | null => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, '{}');
  return windowsAccessProblem(file, fakeTools(lines, me));
};

const privateTo = (owner: string, ...entries: string[]): boolean => problemOf([`O ${owner}`, 'P True', ...entries]) === null;

describe('the Windows access check on the discovery file', () => {
  it('trusts the user, SYSTEM and Administrators as owner and as access entries, by full SID', () => {
    expect(privateTo(ME, FULL(ME))).toBe(true);
    expect(privateTo('S-1-5-32-544', FULL('S-1-5-18'), FULL('S-1-5-32-544'), FULL(ME))).toBe(true);
    expect(privateTo('S-1-5-18', FULL(ME), 'E Deny S-1-1-0 FullControl')).toBe(true);
    expect(problemOf([`O ${BUILTIN_ADMIN}`, 'P True', FULL(BUILTIN_ADMIN)], BUILTIN_ADMIN)).toBeNull();
  });

  it('refuses any other owner or access entry', () => {
    expect(privateTo(OTHER, FULL(ME))).toBe(false);
    expect(privateTo(ME, FULL(ME), 'E Allow S-1-5-32-545 ReadAndExecute, Synchronize')).toBe(false);
    expect(privateTo(ME, FULL(ME), 'E Allow S-1-5-11 ReadAndExecute, Synchronize')).toBe(false);
    expect(privateTo(ME, FULL(ME), FULL('S-1-1-0'))).toBe(false);
    expect(privateTo(ME, FULL(ME), FULL('S-1-15-2-1'))).toBe(false);
    expect(privateTo(ME, FULL(OTHER))).toBe(false);
    expect(privateTo(ME)).toBe(false);
    expect(privateTo('LA', FULL('LA'))).toBe(false);
    expect(problemOf([])).not.toBeNull();
  });

  it('names the owner and each unexpected entry it found, and why it could not read them', () => {
    expect(problemOf([`O ${OTHER}`, 'P False', FULL(ME), 'E Allow S-1-5-32-545 ReadAndExecute, Synchronize'])).toBe(
      `owner ${OTHER} (not trusted); access list protected: False; unexpected entries: Allow S-1-5-32-545 ReadAndExecute, Synchronize; you are ${ME}`,
    );
    const file = join(tempDir(), 'bridge.json');
    writeFileSync(file, '{}');
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
    expect(windowsAccessProblem(open)).toMatch(/unexpected entries: (?:.* \| )?Allow S-1-5-32-545 /);
  });
});
