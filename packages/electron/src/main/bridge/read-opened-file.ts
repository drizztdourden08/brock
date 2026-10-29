/* @layer electron-main @kind logic */
import { closeSync, constants, fstatSync, openSync, readFileSync } from 'fs';
import { BRIDGE_OTHERS_MASK } from './bridge.constants';
import { refusePrivateFile } from './refuse-private-file';

const checkHandle = (file: string, fd: number, uid: number | undefined): void => {
  const stat = fstatSync(fd);
  if (!stat.isFile()) throw refusePrivateFile(file, 'is not a plain file');
  if (uid === undefined) return;
  if (stat.uid !== uid) throw refusePrivateFile(file, 'belongs to another user');
  if ((stat.mode & BRIDGE_OTHERS_MASK) !== 0) throw refusePrivateFile(file, 'is open to other users');
};

const noFollow = (): number => {
  const flag: unknown = Reflect.get(constants, 'O_NOFOLLOW');
  return typeof flag === 'number' ? flag : 0;
};

const readOpenedFile = (file: string, uid: number | undefined): string => {
  const fd = openSync(file, constants.O_RDONLY | noFollow());
  try {
    checkHandle(file, fd, uid);
    return readFileSync(fd, 'utf8');
  } finally {
    closeSync(fd);
  }
};

export { readOpenedFile };
