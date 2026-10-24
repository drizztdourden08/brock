/* @layer electron-main @kind logic */
import { timingSafeEqual } from 'crypto';
import { signRecent } from './sign-recent';

const recentSigned = (key: Buffer, profileId: string, path: string, sig: string): boolean => {
  const expected = Buffer.from(signRecent(key, profileId, path));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
};

export { recentSigned };
