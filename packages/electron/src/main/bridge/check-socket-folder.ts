/* @layer electron-main @kind logic */
import { lstatSync } from 'fs';
import { dirname } from 'path';
import type { PathStat } from './bridge.type';
import { BRIDGE_DIR_MODE, BRIDGE_PERMISSION_BITS } from './bridge.constants';

const statOf = (path: string, lstat: (path: string) => PathStat): PathStat => {
  try {
    return lstat(path);
  } catch {
    throw new Error(`The app is not running: ${path} is gone.`);
  }
};

const checkSocketFolder = (endpoint: string, uid: number, lstat: (path: string) => PathStat = lstatSync): void => {
  const folder = statOf(dirname(endpoint), lstat);
  const privateFolder = !folder.isSymbolicLink() && folder.isDirectory() && folder.uid === uid && (folder.mode & BRIDGE_PERMISSION_BITS) === BRIDGE_DIR_MODE;
  if (!privateFolder) throw new Error(`${dirname(endpoint)} is not a private folder of this user; the bridge refuses it.`);
  const socket = statOf(endpoint, lstat);
  if (!socket.isSocket() || socket.uid !== uid) throw new Error(`${endpoint} is not a socket of this user; the bridge refuses it.`);
};

export { checkSocketFolder };
