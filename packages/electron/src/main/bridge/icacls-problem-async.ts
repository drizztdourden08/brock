/* @layer electron-main @kind logic */
import { promises } from 'fs';
import { basename, dirname } from 'path';
import type { AsyncSystemToolRun } from './bridge.type';
import { BRIDGE_PLAIN_FILE_NAME, BRIDGE_UNSURE_NAME } from './bridge.constants';
import { icaclsVerdict, ownerArgs, saveArgs, savedAclPath } from './icacls-check';
import { windowsUserAsync } from './windows-user-async';

const icaclsProblemAsync = async (file: string, run: AsyncSystemToolRun): Promise<string | null> => {
  const name = basename(file);
  if (!BRIDGE_PLAIN_FILE_NAME.test(name)) return BRIDGE_UNSURE_NAME;
  const cwd = dirname(file);
  const saved = savedAclPath();
  try {
    const [user, , listing] = await Promise.all([
      windowsUserAsync(run),
      run('icacls.exe', saveArgs(name, saved), { cwd }),
      run('cmd.exe', ownerArgs(name), { cwd }),
    ]);
    const sddl = (await promises.readFile(saved)).toString('utf16le');
    return icaclsVerdict(name, listing, sddl, user.sid);
  } finally {
    await promises.rm(saved, { force: true });
  }
};

export { icaclsProblemAsync };
