/* @layer electron-main @kind test */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { readBridgeDiscoveryAsync, writeBridgeDiscovery } from '../src/bridge';
import { windowsAccessProblemAsync } from '../src/main/bridge/windows-access-problem-async';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';
import { ADMINISTRATORS, ME, NOT_PRIVATE, OTHER, SYSTEM, USERS, allow, reading, security, whoami } from './file-security-fixture';

afterEach(closeOpened);

const privateFile = (): string => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, '{}');
  return file;
};

const OWN = security(ME, allow(ME), allow(SYSTEM), allow(ADMINISTRATORS));
const OPEN = security(ME, allow(ME), allow(USERS));

describe('K4 the async Windows access check', { tags: ['critical'] }, () => {
  it('accepts a private file by SID, starting only whoami', async () => {
    const tools = whoami();
    expect(await windowsAccessProblemAsync(privateFile(), reading(OWN).read, tools.runAsync)).toBeNull();
    expect(tools.calls).toEqual(['whoami.exe']);
  });

  it('accepts a file owned by Administrators, as an elevated app writes it', async () => {
    const elevated = security(ADMINISTRATORS, allow(ADMINISTRATORS), allow(ME));
    expect(await windowsAccessProblemAsync(privateFile(), reading(elevated).read, whoami().runAsync)).toBeNull();
  });

  it('refuses a file open to another group or owned by another account', async () => {
    for (const answer of [OPEN, security(OTHER, allow(ME))]) {
      expect(await windowsAccessProblemAsync(privateFile(), reading(answer).read, whoami().runAsync)).toBe(NOT_PRIVATE);
    }
  });

  it('says why it could not read the owner and access list', async () => {
    const broken = reading(new Error('GetNamedSecurityInfoW failed with code 5'));
    expect(await windowsAccessProblemAsync(privateFile(), broken.read, whoami().runAsync)).toBe('could not read its owner and access list: GetNamedSecurityInfoW failed with code 5');
  });

  it('skips the check for a file it accepted and that has not changed', async () => {
    const file = privateFile();
    expect(await windowsAccessProblemAsync(file, reading(OWN).read, whoami().runAsync)).toBeNull();
    const again = reading(OWN);
    expect(await windowsAccessProblemAsync(file, again.read, whoami().runAsync)).toBeNull();
    expect(again.files).toEqual([]);
  });

  it('checks again when the file changed, and refuses it if the list is now open', async () => {
    const file = privateFile();
    expect(await windowsAccessProblemAsync(file, reading(OWN).read, whoami().runAsync)).toBeNull();
    writeFileSync(file, '{"changed":true}');
    const second = reading(OPEN);
    expect(await windowsAccessProblemAsync(file, second.read, whoami().runAsync)).toBe(NOT_PRIVATE);
    expect(second.files).toHaveLength(1);
  });

  it('never remembers a refusal', async () => {
    const file = privateFile();
    expect(await windowsAccessProblemAsync(file, reading(OPEN).read, whoami().runAsync)).not.toBeNull();
    const again = reading(OPEN);
    expect(await windowsAccessProblemAsync(file, again.read, whoami().runAsync)).not.toBeNull();
    expect(again.files).toHaveLength(1);
  });
});

describe.runIf(process.platform === 'win32')('E2 the async read on a real file', { tags: ['e2e'] }, () => {
  it('reads the discovery file the bridge wrote and refuses one open to other accounts', async () => {
    const { server } = await serve();
    const file = join(tempDir(), 'bridge.json');
    writeBridgeDiscovery(file, discoveryOf(server));
    expect((await readBridgeDiscoveryAsync(file)).endpoint).toBe(server.endpoint);
    const open = join(tempDir(), 'open.json');
    writeOpenFile(open, JSON.stringify(discoveryOf(server)));
    await expect(readBridgeDiscoveryAsync(open)).rejects.toThrow(/open to other accounts/);
  });
});
