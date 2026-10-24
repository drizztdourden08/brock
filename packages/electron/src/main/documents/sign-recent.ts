/* @layer electron-main @kind logic */
import { createHmac } from 'crypto';
import { pathKey } from './path-key';

const signRecent = (key: Buffer, profileId: string, path: string): string =>
  createHmac('sha256', key).update(`${profileId}\0${pathKey(path)}`).digest('hex');

export { signRecent };
