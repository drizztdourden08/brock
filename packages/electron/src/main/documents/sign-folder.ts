/* @layer electron-main @kind logic */
import { createHmac } from 'crypto';
import { pathKey } from './path-key';

const signFolder = (key: Buffer, profileId: string, path: string): string =>
  createHmac('sha256', key).update(`folder\0${profileId}\0${pathKey(path)}`).digest('hex');

export { signFolder };
