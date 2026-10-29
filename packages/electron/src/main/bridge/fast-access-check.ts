/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { basename, dirname, join } from 'path';
import type { AsyncSystemToolRun } from './bridge.type';
import { BRIDGE_PLAIN_FILE_NAME } from './bridge.constants';
import { fileOwnerIs } from './file-owner-is';
import { sddlIsPrivate } from './sddl-is-private';
import { windowsUserAsync } from './windows-user-async';

const accountOf = (): string => `${process.env.USERDOMAIN ?? ''}\\${process.env.USERNAME ?? ''}`;

const fastAccessCheck = async (file: string, run: AsyncSystemToolRun): Promise<boolean> => {
  const name = basename(file);
  if (!BRIDGE_PLAIN_FILE_NAME.test(name)) return false;
  const cwd = dirname(file);
  const saved = join(tmpdir(), `brock-acl-${randomBytes(8).toString('hex')}.txt`);
  try {
    const [user, , listing] = await Promise.all([
      windowsUserAsync(run),
      run('icacls.exe', [name, '/save', saved, '/c'], { cwd }),
      run('cmd.exe', ['/d', '/c', 'dir', '/q', name], { cwd }),
    ]);
    const sddl = (await readFile(saved)).toString('utf16le');
    return fileOwnerIs(listing.toString('latin1'), accountOf(), name) && sddlIsPrivate(sddl, user.sid);
  } catch {
    return false;
  } finally {
    await rm(saved, { force: true });
  }
};

export { fastAccessCheck };
