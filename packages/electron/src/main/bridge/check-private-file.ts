/* @layer electron-main @kind logic */
import { statSync } from 'fs';
import { BRIDGE_OTHERS_MASK } from './bridge.constants';
import { grantsOnlyUser } from './grants-only-user';

const checkPrivateFile = (file: string): void => {
  const uid = process.getuid?.();
  if (uid === undefined) {
    if (!grantsOnlyUser(file)) throw new Error(`${file} is open to other accounts; the bridge refuses it.`);
    return;
  }
  const stat = statSync(file);
  if (stat.uid !== uid) throw new Error(`${file} belongs to another user; the bridge refuses it.`);
  if ((stat.mode & BRIDGE_OTHERS_MASK) !== 0) throw new Error(`${file} is open to other users; the bridge refuses it.`);
};

export { checkPrivateFile };
