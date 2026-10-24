/* @layer electron-main @kind logic */
import { closeSync, constants, fstatSync, lstatSync, openSync, readFileSync, type Stats } from 'fs';
import { dirname } from 'path';
import { BRIDGE_OTHERS_MASK, BRIDGE_WORLD_WRITABLE } from './bridge.constants';
import { windowsAccessProblem } from './windows-access-problem';

const refuse = (file: string, why: string): Error => new Error(`${file} ${why}; the bridge refuses it.`);

const lstatOf = (file: string): Stats => {
  try {
    return lstatSync(file);
  } catch {
    throw new Error(`The app is not running, or its bridge is off: ${file} is missing.`);
  }
};

const checkFolder = (file: string, uid: number): void => {
  const folder = lstatSync(dirname(file));
  if (folder.isSymbolicLink() || !folder.isDirectory() || folder.uid !== uid) throw refuse(dirname(file), 'is not a folder of this user');
  if ((folder.mode & BRIDGE_WORLD_WRITABLE) !== 0) throw refuse(dirname(file), 'is open for anyone to write');
};

const checkHandle = (file: string, fd: number, uid: number | undefined): void => {
  const stat = fstatSync(fd);
  if (!stat.isFile()) throw refuse(file, 'is not a plain file');
  if (uid === undefined) return;
  if (stat.uid !== uid) throw refuse(file, 'belongs to another user');
  if ((stat.mode & BRIDGE_OTHERS_MASK) !== 0) throw refuse(file, 'is open to other users');
};

const noFollow = (): number => {
  const flag: unknown = Reflect.get(constants, 'O_NOFOLLOW');
  return typeof flag === 'number' ? flag : 0;
};

const readPrivateFile = (file: string): string => {
  const link = lstatOf(file);
  if (link.isSymbolicLink() || !link.isFile()) throw refuse(file, 'is a link or not a plain file');
  const uid = process.getuid?.();
  if (uid === undefined) {
    const problem = windowsAccessProblem(file);
    if (problem) throw refuse(file, `is open to other accounts (${problem})`);
  } else {
    checkFolder(file, uid);
  }
  const fd = openSync(file, constants.O_RDONLY | noFollow());
  try {
    checkHandle(file, fd, uid);
    return readFileSync(fd, 'utf8');
  } finally {
    closeSync(fd);
  }
};

export { readPrivateFile };
