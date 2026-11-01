/* @layer electron-main @kind test */
import { writeFileSync } from 'fs';
import { vi } from 'vitest';

const ME = 'S-1-5-21-1-2-3-1001';
const ACCOUNT = String.raw`PC\me`;
const OTHER_ACCOUNT = String.raw`PC\other`;
const NOT_PRIVATE = 'icacls could not confirm that only you, SYSTEM and Administrators can reach it';
const TOOLS = ['whoami.exe', 'icacls.exe', 'cmd.exe'];
const BYTE_ORDER_MARK = String.fromCodePoint(0xfeff);

const stubAccount = (): void => {
  vi.stubEnv('USERDOMAIN', 'PC');
  vi.stubEnv('USERNAME', 'me');
};

const toolAnswer = (exe: string, args: string[], sddl: string, owner: string): Buffer => {
  if (exe === 'whoami.exe') return Buffer.from(`"${ACCOUNT}","${ME}"\r\n`, 'latin1');
  if (exe === 'icacls.exe') {
    writeFileSync(args[2] ?? '', Buffer.from(`${BYTE_ORDER_MARK}${args[0]}\r\n${sddl}\r\n`, 'utf16le'));
    return Buffer.from('processed file');
  }
  if (exe === 'cmd.exe') return Buffer.from(`\r\n 2026-10-29  05:48 AM                 4 ${owner}        ${args[4]}\r\n`, 'latin1');
  throw new Error(`${exe} must not run`);
};

export { ACCOUNT, ME, NOT_PRIVATE, OTHER_ACCOUNT, TOOLS, stubAccount, toolAnswer };
