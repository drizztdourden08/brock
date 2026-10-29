/* @layer electron-main @kind logic */
import type { WindowsUser } from './bridge.type';
import { BRIDGE_WHOAMI } from './bridge.constants';

const userOfWhoami = (output: Buffer): WindowsUser => {
  const sid = BRIDGE_WHOAMI.exec(output.toString('latin1'))?.[1];
  if (!sid) throw new Error('could not tell which Windows user runs this process');
  return { sid };
};

export { userOfWhoami };
