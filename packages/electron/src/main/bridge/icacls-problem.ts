/* @layer electron-main @kind logic */
import { readFileSync, rmSync } from 'fs';
import { basename, dirname } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_PLAIN_FILE_NAME, BRIDGE_UNSURE_NAME } from './bridge.constants';
import { icaclsVerdict, ownerArgs, saveArgs, savedAclPath } from './icacls-check';
import { windowsUser } from './windows-user';

const icaclsProblem = (file: string, run: SystemToolRun): string | null => {
  const name = basename(file);
  if (!BRIDGE_PLAIN_FILE_NAME.test(name)) return BRIDGE_UNSURE_NAME;
  const cwd = dirname(file);
  const saved = savedAclPath();
  try {
    const user = windowsUser(run);
    run('icacls.exe', saveArgs(name, saved), { cwd });
    const listing = run('cmd.exe', ownerArgs(name), { cwd });
    return icaclsVerdict(name, listing, readFileSync(saved).toString('utf16le'), user.sid);
  } finally {
    rmSync(saved, { force: true });
  }
};

export { icaclsProblem };
