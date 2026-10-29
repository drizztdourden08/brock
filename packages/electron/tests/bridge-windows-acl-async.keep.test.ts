/* @layer electron-main @kind test */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readBridgeDiscoveryAsync, writeBridgeDiscovery } from '../src/bridge';
import type { AsyncSystemToolRun } from '../src/main/bridge/bridge.type';
import { fileOwnerIs } from '../src/main/bridge/file-owner-is';
import { sddlIsPrivate } from '../src/main/bridge/sddl-is-private';
import { windowsAccessProblemAsync } from '../src/main/bridge/windows-access-problem-async';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';

const ME = 'S-1-5-21-1-2-3-1001';
const OTHER = 'S-1-5-21-1-2-3-1004';
const BYTE_ORDER_MARK = String.fromCodePoint(0xfeff);
const ACCOUNT =String.raw`PC\me`;
const SDDL_ME = `D:PAI(A;;FA;;;${ME})(A;;FA;;;SY)(A;;FA;;;BA)`;
const SDDL_OPEN = `D:PAI(A;;FA;;;${ME})(A;;0x1200a9;;;BU)`;
const POWERSHELL_PRIVATE = [`O ${ME}`, 'P True', `E Allow ${ME} FullControl`].join('\r\n');
const POWERSHELL_OPEN = [`O ${ME}`, 'P False', `E Allow ${ME} FullControl`, 'E Allow S-1-5-32-545 ReadAndExecute'].join('\r\n');

interface Tools {
  run: AsyncSystemToolRun;
  calls: string[];
}

const fakeTools = (sddl: string, powershell: string, owner = ACCOUNT): Tools => {
  const calls: string[] = [];
  const answer = (exe: string, args: string[]): Buffer => {
    if (exe === 'whoami.exe') return Buffer.from(`"${ACCOUNT}","${ME}"\r\n`, 'latin1');
    if (exe === 'icacls.exe') {
      writeFileSync(args[2] ?? '', Buffer.from(`${BYTE_ORDER_MARK}${args[0]}\r\n${sddl}\r\n`, 'utf16le'));
      return Buffer.from('processed file');
    }
    if (exe === 'cmd.exe') return Buffer.from(`\r\n 2026-10-29  05:48 AM                 4 ${owner}        ${args[4]}\r\n`, 'latin1');
    return Buffer.from(powershell, 'latin1');
  };
  const run: AsyncSystemToolRun = (exe, args) => {
    calls.push(exe);
    return Promise.resolve(answer(exe, args));
  };
  return { run, calls };
};

const privateFile = (text = '{}'): string => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, text);
  return file;
};

beforeEach(() => {
  vi.stubEnv('USERDOMAIN', 'PC');
  vi.stubEnv('USERNAME', 'me');
});

afterEach(() => {
  vi.unstubAllEnvs();
  closeOpened();
});

describe('the quick access check', () => {
  it('accepts an access list that holds only the user, SYSTEM and Administrators', () => {
    expect(sddlIsPrivate(SDDL_ME, ME)).toBe(true);
    expect(sddlIsPrivate(`D:P(A;;FA;;;S-1-5-18)(D;;FA;;;WD)`, ME)).toBe(true);
  });

  it('refuses anything else, an empty list or text it cannot read', () => {
    expect(sddlIsPrivate(SDDL_OPEN, ME)).toBe(false);
    expect(sddlIsPrivate(`D:PAI(A;;FA;;;${OTHER})`, ME)).toBe(false);
    expect(sddlIsPrivate(`D:PAI(A;;FA;;;WD)`, ME)).toBe(false);
    expect(sddlIsPrivate(`D:PAI(XA;;FA;;;${ME};(@User.x==1))`, ME)).toBe(false);
    expect(sddlIsPrivate('D:PAI', ME)).toBe(false);
    expect(sddlIsPrivate('', ME)).toBe(false);
  });

  it('accepts only the exact account as owner, right before the file name', () => {
    const listing = (owner: string): string => ` 2026-10-29  05:48 AM                 4 ${owner}        bridge.json\r\n`;
    expect(fileOwnerIs(listing(ACCOUNT), ACCOUNT, 'bridge.json')).toBe(true);
    expect(fileOwnerIs(listing(String.raw`PC\other`), ACCOUNT, 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(String.raw`BUILTIN\Administrators`), ACCOUNT, 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), ACCOUNT, 'other.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), '\\', 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), 'me', 'bridge.json')).toBe(false);
  });
});

describe('the async Windows access check', () => {
  it('accepts a private file with the quick check alone, never starting PowerShell', async () => {
    const tools = fakeTools(SDDL_ME, POWERSHELL_PRIVATE);
    expect(await windowsAccessProblemAsync(privateFile(), tools.run)).toBeNull();
    expect(tools.calls).not.toContain('WindowsPowerShell\\v1.0\\powershell.exe');
  });

  it('refuses a file open to another group, with the full check naming it', async () => {
    const tools = fakeTools(SDDL_OPEN, POWERSHELL_OPEN);
    const problem = await windowsAccessProblemAsync(privateFile(), tools.run);
    expect(problem).toContain('unexpected entries: Allow S-1-5-32-545 ReadAndExecute');
    expect(tools.calls).toContain('WindowsPowerShell\\v1.0\\powershell.exe');
  });

  it('does not take the quick check when the owner is not this account', async () => {
    const tools = fakeTools(SDDL_ME, POWERSHELL_OPEN, String.raw`PC\other`);
    expect(await windowsAccessProblemAsync(privateFile(), tools.run)).not.toBeNull();
    expect(tools.calls).toContain('WindowsPowerShell\\v1.0\\powershell.exe');
  });

  it('says why it could not read the access list when both checks fail', async () => {
    const run: AsyncSystemToolRun = () => Promise.reject(new Error('icacls.exe exited with 5'));
    expect(await windowsAccessProblemAsync(privateFile(), run)).toBe('could not read its owner and access list: icacls.exe exited with 5');
  });

  it('skips the check for a file it accepted and that has not changed', async () => {
    const tools = fakeTools(SDDL_ME, POWERSHELL_PRIVATE);
    const file = privateFile();
    expect(await windowsAccessProblemAsync(file, tools.run)).toBeNull();
    const used = tools.calls.length;
    expect(await windowsAccessProblemAsync(file, tools.run)).toBeNull();
    expect(tools.calls).toHaveLength(used);
  });

  it('checks again when the file changed, and refuses it if the list is now open', async () => {
    const file = privateFile();
    const first = fakeTools(SDDL_ME, POWERSHELL_PRIVATE);
    expect(await windowsAccessProblemAsync(file, first.run)).toBeNull();
    writeFileSync(file, '{"changed":true}');
    const second = fakeTools(SDDL_OPEN, POWERSHELL_OPEN);
    expect(await windowsAccessProblemAsync(file, second.run)).not.toBeNull();
    expect(second.calls.length).toBeGreaterThan(0);
  });

  it('never remembers a refusal', async () => {
    const file = privateFile();
    const open = fakeTools(SDDL_OPEN, POWERSHELL_OPEN);
    expect(await windowsAccessProblemAsync(file, open.run)).not.toBeNull();
    const again = fakeTools(SDDL_OPEN, POWERSHELL_OPEN);
    expect(await windowsAccessProblemAsync(file, again.run)).not.toBeNull();
    expect(again.calls.length).toBeGreaterThan(0);
  });
});

describe.runIf(process.platform === 'win32')('the async read on a real file', () => {
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
