/* @layer electron-main @kind test */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readBridgeDiscoveryAsync, writeBridgeDiscovery } from '../src/bridge';
import type { AsyncSystemToolRun } from '../src/main/bridge/bridge.type';
import { fileOwnerIs } from '../src/main/bridge/file-owner-is';
import { sddlIsPrivate } from '../src/main/bridge/sddl-is-private';
import { windowsAccessProblemAsync } from '../src/main/bridge/windows-access-problem-async';
import { ACCOUNT, ME, NOT_PRIVATE, OTHER_ACCOUNT, TOOLS, stubAccount, toolAnswer } from './icacls-fixture';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';

const OTHER = 'S-1-5-21-1-2-3-1004';
const SDDL_ME = `D:PAI(A;;FA;;;${ME})(A;;FA;;;SY)(A;;FA;;;BA)`;
const SDDL_OPEN = `D:PAI(A;;FA;;;${ME})(A;;0x1200a9;;;BU)`;
interface Tools {
  run: AsyncSystemToolRun;
  calls: string[];
}

const fakeTools = (sddl: string, owner = ACCOUNT): Tools => {
  const calls: string[] = [];
  const run: AsyncSystemToolRun = (exe, args) => {
    calls.push(exe);
    return Promise.resolve(toolAnswer(exe, args, sddl, owner));
  };
  return { run, calls };
};

const privateFile = (text = '{}'): string => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, text);
  return file;
};

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
    expect(fileOwnerIs(listing(OTHER_ACCOUNT), ACCOUNT, 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(String.raw`BUILTIN\Administrators`), ACCOUNT, 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), ACCOUNT, 'other.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), '\\', 'bridge.json')).toBe(false);
    expect(fileOwnerIs(listing(ACCOUNT), 'me', 'bridge.json')).toBe(false);
  });
});

describe('the async Windows access check', () => {
  beforeEach(stubAccount);

  it('accepts a private file with icacls alone, never starting PowerShell', async () => {
    const tools = fakeTools(SDDL_ME);
    expect(await windowsAccessProblemAsync(privateFile(), tools.run)).toBeNull();
    expect(tools.calls.every((exe) => TOOLS.includes(exe))).toBe(true);
  });

  it('refuses a file open to another group or owned by another account, naming why, without PowerShell', async () => {
    for (const tools of [fakeTools(SDDL_OPEN), fakeTools(SDDL_ME, OTHER_ACCOUNT)]) {
      expect(await windowsAccessProblemAsync(privateFile(), tools.run)).toBe(NOT_PRIVATE);
      expect(tools.calls.every((exe) => TOOLS.includes(exe))).toBe(true);
    }
  });

  it('refuses a file name icacls cannot be asked about, before running any tool', async () => {
    const tools = fakeTools(SDDL_ME);
    const file = join(tempDir(), 'odd name&.json');
    writeFileSync(file, '{}');
    expect(await windowsAccessProblemAsync(file, tools.run)).toBe('its name is not plain, so icacls cannot be asked about it safely');
    expect(tools.calls).toEqual([]);
  });

  it('refuses with the reason when icacls is missing or fails', async () => {
    const run: AsyncSystemToolRun = () => Promise.reject(new Error('icacls.exe exited with 5'));
    expect(await windowsAccessProblemAsync(privateFile(), run)).toBe('could not read its owner and access list: icacls.exe exited with 5');
  });

  it('skips the check for a file it accepted and that has not changed', async () => {
    const tools = fakeTools(SDDL_ME);
    const file = privateFile();
    expect(await windowsAccessProblemAsync(file, tools.run)).toBeNull();
    const used = tools.calls.length;
    expect(await windowsAccessProblemAsync(file, tools.run)).toBeNull();
    expect(tools.calls).toHaveLength(used);
  });

  it('checks again when the file changed, and refuses it if the list is now open', async () => {
    const file = privateFile();
    const first = fakeTools(SDDL_ME);
    expect(await windowsAccessProblemAsync(file, first.run)).toBeNull();
    writeFileSync(file, '{"changed":true}');
    const second = fakeTools(SDDL_OPEN);
    expect(await windowsAccessProblemAsync(file, second.run)).not.toBeNull();
    expect(second.calls.length).toBeGreaterThan(0);
  });

  it('never remembers a refusal', async () => {
    const file = privateFile();
    const open = fakeTools(SDDL_OPEN);
    expect(await windowsAccessProblemAsync(file, open.run)).not.toBeNull();
    const again = fakeTools(SDDL_OPEN);
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
