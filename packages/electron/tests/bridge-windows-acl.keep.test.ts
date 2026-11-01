/* @layer electron-main @kind test */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readBridgeDiscovery, writeBridgeDiscovery } from '../src/bridge';
import { windowsAccessProblem } from '../src/main/bridge/windows-access-problem';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';
import { ADMINISTRATORS, EVERYONE, ME, NOT_PRIVATE, OTHER, SYSTEM, USERS, allow, deny, reading, security, whoami } from './file-security-fixture';
import type { FileSecurity } from '../src/main/bridge/bridge.type';

afterEach(() => {
  vi.unstubAllEnvs();
  closeOpened();
});

const fileIn = (name = 'bridge.json'): string => {
  const file = join(tempDir(), name);
  writeFileSync(file, '{}');
  return file;
};

const problemOf = (answer: FileSecurity | Error, file = fileIn()): string | null => windowsAccessProblem(file, reading(answer).read, whoami().run);

describe('K4 the Windows access check on the discovery file', { tags: ['critical'] }, () => {
  it('trusts the user, SYSTEM and Administrators as owner and as access entries, by SID', () => {
    expect(problemOf(security(ME, allow(ME)))).toBeNull();
    expect(problemOf(security(ME, allow(ME), allow(SYSTEM), allow(ADMINISTRATORS)))).toBeNull();
    expect(problemOf(security(ADMINISTRATORS, allow(SYSTEM), allow(ADMINISTRATORS), allow(ME)))).toBeNull();
    expect(problemOf(security(SYSTEM, allow(ME), deny(EVERYONE)))).toBeNull();
  });

  it('never looks at account names, so long and localized names make no difference', () => {
    vi.stubEnv('USERDOMAIN', 'ORDINATEUR-DE-BUREAU');
    vi.stubEnv('USERNAME', 'Jean-Christophe Dupont-Lachapelle');
    expect(problemOf(security(ME, allow(ME)))).toBeNull();
    expect(problemOf(security(OTHER, allow(ME)))).toBe(NOT_PRIVATE);
  });

  it('refuses any other owner or access entry', () => {
    expect(problemOf(security(OTHER, allow(ME)))).toBe(NOT_PRIVATE);
    expect(problemOf(security(ME, allow(ME), allow(USERS)))).toBe(NOT_PRIVATE);
    expect(problemOf(security(ME, allow(ME), allow(EVERYONE)))).toBe(NOT_PRIVATE);
    expect(problemOf(security(ME, allow(OTHER)))).toBe(NOT_PRIVATE);
    expect(problemOf(security(ME, allow(ME), { kind: 'other', sid: '' }))).toBe(NOT_PRIVATE);
    expect(problemOf(security(ME))).toBe(NOT_PRIVATE);
  });

  it('accepts a file name with spaces and symbols, since no tool is asked about it', () => {
    expect(problemOf(security(ME, allow(ME)), fileIn('odd name&.json'))).toBeNull();
  });

  it('says why it could not read the owner and access list, and runs only whoami', () => {
    const tools = whoami();
    const broken = reading(new Error('GetNamedSecurityInfoW failed with code 5'));
    expect(windowsAccessProblem(fileIn(), broken.read, tools.run)).toBe('could not read its owner and access list: GetNamedSecurityInfoW failed with code 5');
    expect(tools.calls.filter((call) => call !== 'whoami.exe')).toEqual([]);
  });

  it('skips the check for a file it accepted and that has not changed', () => {
    const file = fileIn();
    const first = reading(security(ME, allow(ME)));
    expect(windowsAccessProblem(file, first.read, whoami().run)).toBeNull();
    const second = reading(security(ME, allow(ME)));
    expect(windowsAccessProblem(file, second.read, whoami().run)).toBeNull();
    expect(second.files).toEqual([]);
  });
});

describe('E2 the Windows access check on a real file', { tags: ['e2e'] }, () => {
  it.runIf(process.platform === 'win32')('reads a real file in a folder with a non-ASCII name', async () => {
    const { server } = await serve();
    const folder = join(tempDir(), 'dossier-été');
    mkdirSync(folder);
    const file = join(folder, 'bridge.json');
    writeBridgeDiscovery(file, discoveryOf(server));
    expect(readBridgeDiscovery(file).endpoint).toBe(server.endpoint);
    const open = join(folder, 'open.json');
    writeOpenFile(open, JSON.stringify(discoveryOf(server)));
    expect(windowsAccessProblem(open)).toBe(NOT_PRIVATE);
  });
});
