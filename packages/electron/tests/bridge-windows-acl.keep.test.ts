/* @layer electron-main @kind test */
import { mkdirSync, writeFileSync } from 'fs';
import { userInfo } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readBridgeDiscovery, writeBridgeDiscovery } from '../src/bridge';
import type { SystemToolRun } from '../src/main/bridge/bridge.type';
import { isUserOnlyFile } from '../src/main/bridge/is-user-only-file';
import { closeOpened, discoveryOf, serve, tempDir } from './bridge-fixture';

afterEach(() => {
  vi.unstubAllEnvs();
  closeOpened();
});

const SID = 'S-1-5-21-1-2-3-1001';

const fakeTools = (dacl: string, owner: string): SystemToolRun => (exe, args) => {
  if (exe === 'whoami.exe') return Buffer.from(`"pc\\someone","${SID}"\r\n`, 'latin1');
  if (exe === 'icacls.exe') writeFileSync(args[2] ?? '', `bridge.json\r\n${dacl}\r\n`, 'utf16le');
  return Buffer.from(`2026-10-23  06:34 PM   1 ${owner}        bridge.json\r\n`, 'utf16le');
};

describe('the Windows access check on the discovery file', () => {
  it('accepts one full control entry for the user, owned by the user, and nothing else', () => {
    vi.stubEnv('USERDOMAIN', 'PC');
    const file = join(tempDir(), 'bridge.json');
    writeFileSync(file, '{}');
    const me = `PC\\${userInfo().username}`;
    expect(isUserOnlyFile(file, fakeTools(`D:P(A;;FA;;;${SID})`, me))).toBe(true);
    expect(isUserOnlyFile(file, fakeTools(`D:P(A;;FA;;;${SID})`, 'PC\\intruder'))).toBe(false);
    expect(isUserOnlyFile(file, fakeTools(`D:(A;;FA;;;${SID})`, me))).toBe(false);
    expect(isUserOnlyFile(file, fakeTools(`D:P(A;;FA;;;${SID})(A;;0x1200a9;;;S-1-5-21-1-2-3-1004)`, me))).toBe(false);
    expect(isUserOnlyFile(join(tempDir(), 'odd & name.json'), fakeTools(`D:P(A;;FA;;;${SID})`, me))).toBe(false);
  });

  it.runIf(process.platform === 'win32')('reads a real file in a folder with a non-ASCII name', async () => {
    const { server } = await serve();
    const folder = join(tempDir(), 'dossier-été');
    mkdirSync(folder);
    const file = join(folder, 'bridge.json');
    writeBridgeDiscovery(file, discoveryOf(server));
    expect(readBridgeDiscovery(file).endpoint).toBe(server.endpoint);
    const open = join(folder, 'open.json');
    writeFileSync(open, JSON.stringify(discoveryOf(server)));
    expect(isUserOnlyFile(open)).toBe(false);
  });
});
