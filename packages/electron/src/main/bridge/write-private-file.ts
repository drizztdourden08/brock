/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { BRIDGE_DIR_MODE, BRIDGE_FILE_MODE } from './bridge.constants';
import { restrictToUser } from './restrict-to-user';

const writePrivateFile = (file: string, text: string): void => {
  mkdirSync(dirname(file), { recursive: true, mode: BRIDGE_DIR_MODE });
  const partial = `${file}.${randomBytes(8).toString('hex')}.tmp`;
  try {
    writeFileSync(partial, '', { mode: BRIDGE_FILE_MODE, flag: 'wx' });
    if (process.platform === 'win32') restrictToUser(partial);
    writeFileSync(partial, text);
    renameSync(partial, file);
  } catch (error) {
    rmSync(partial, { force: true });
    throw error;
  }
};

export { writePrivateFile };
