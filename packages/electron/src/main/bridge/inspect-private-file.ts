/* @layer electron-main @kind logic */
import { lstatSync, type Stats } from 'fs';
import { dirname } from 'path';
import { BRIDGE_WORLD_WRITABLE } from './bridge.constants';
import { refusePrivateFile } from './refuse-private-file';

const lstatOf = (file: string): Stats => {
  try {
    return lstatSync(file);
  } catch {
    throw new Error(`The app is not running, or its bridge is off: ${file} is missing.`);
  }
};

const checkFolder = (file: string, uid: number): void => {
  const folder = lstatSync(dirname(file));
  if (folder.isSymbolicLink() || !folder.isDirectory() || folder.uid !== uid) throw refusePrivateFile(dirname(file), 'is not a folder of this user');
  if ((folder.mode & BRIDGE_WORLD_WRITABLE) !== 0) throw refusePrivateFile(dirname(file), 'is open for anyone to write');
};

const inspectPrivateFile = (file: string): number | undefined => {
  const link = lstatOf(file);
  if (link.isSymbolicLink() || !link.isFile()) throw refusePrivateFile(file, 'is a link or not a plain file');
  const uid = process.getuid?.();
  if (uid !== undefined) checkFolder(file, uid);
  return uid;
};

export { inspectPrivateFile };
