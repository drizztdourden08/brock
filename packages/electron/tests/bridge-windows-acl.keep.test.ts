/* @layer electron-main @kind test */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readBridgeDiscovery, writeBridgeDiscovery } from '../src/bridge';
import type { SystemToolRun } from '../src/main/bridge/bridge.type';
import { windowsAccessProblem } from '../src/main/bridge/windows-access-problem';
import { ACCOUNT, ME, NOT_PRIVATE, OTHER_ACCOUNT, TOOLS, stubAccount, toolAnswer } from './icacls-fixture';
import { closeOpened, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';

interface Tools {
  run: SystemToolRun;
  calls: string[];
}

const OTHER = 'S-1-5-21-1-2-3-1004';

const fakeTools = (sddl: string, owner = ACCOUNT): Tools => {
  const calls: string[] = [];
  const run: SystemToolRun = (exe, args) => {
    calls.push(exe);
    return toolAnswer(exe, args, sddl, owner);
  };
  return { run, calls };
};

const problemOf = (sddl: string, owner?: string): { problem: string | null; tools: Tools } => {
  const file = join(tempDir(), 'bridge.json');
  writeFileSync(file, '{}');
  const tools = fakeTools(sddl, owner);
  return { problem: windowsAccessProblem(file, tools.run), tools };
};

afterEach(() => {
  vi.unstubAllEnvs();
  closeOpened();
});

describe('the Windows access check on the discovery file', () => {
  beforeEach(stubAccount);

  it('accepts an access list of the user, SYSTEM and Administrators, using icacls only', () => {
    const { problem, tools } = problemOf(`D:PAI(A;;FA;;;${ME})(A;;FA;;;SY)(A;;FA;;;BA)`);
    expect(problem).toBeNull();
    expect(tools.calls.every((exe) => TOOLS.includes(exe))).toBe(true);
  });

  it('refuses any other trustee, an empty list or an owner that is not the account', () => {
    expect(problemOf(`D:PAI(A;;FA;;;${ME})(A;;0x1200a9;;;BU)`).problem).toBe(NOT_PRIVATE);
    expect(problemOf(`D:PAI(A;;FA;;;${OTHER})`).problem).toBe(NOT_PRIVATE);
    expect(problemOf(`D:PAI(A;;FA;;;WD)`).problem).toBe(NOT_PRIVATE);
    expect(problemOf('D:PAI').problem).toBe(NOT_PRIVATE);
    expect(problemOf(`D:PAI(A;;FA;;;${ME})`, OTHER_ACCOUNT).problem).toBe(NOT_PRIVATE);
  });

  it('refuses with the reason when icacls is missing or fails, never trying PowerShell', () => {
    const file = join(tempDir(), 'bridge.json');
    writeFileSync(file, '{}');
    const calls: string[] = [];
    const broken: SystemToolRun = (exe) => {
      calls.push(exe);
      if (exe === 'whoami.exe') return Buffer.from(`"me","${ME}"`, 'latin1');
      throw new Error('icacls.exe exited with 1: not found');
    };
    expect(windowsAccessProblem(file, broken)).toBe('could not read its owner and access list: icacls.exe exited with 1: not found');
    expect(calls.every((exe) => TOOLS.includes(exe))).toBe(true);
  });

  it('refuses a file name icacls cannot be asked about, before running any tool', () => {
    const file = join(tempDir(), 'odd name&.json');
    writeFileSync(file, '{}');
    const tools = fakeTools(`D:PAI(A;;FA;;;${ME})`);
    expect(windowsAccessProblem(file, tools.run)).toBe('its name is not plain, so icacls cannot be asked about it safely');
    expect(tools.calls).toEqual([]);
  });

});

describe.runIf(process.platform === 'win32')('the Windows access check on a real file', () => {
  it('reads a real file in a folder with a non-ASCII name', async () => {
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
