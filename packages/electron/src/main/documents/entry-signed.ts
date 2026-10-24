/* @layer electron-main @kind logic */
import { timingSafeEqual } from 'crypto';
import type { EntrySigner } from './entry-signed.type';

const entrySigned = (sign: EntrySigner) => (key: Buffer, profileId: string, path: string, sig: string): boolean => {
  const expected = Buffer.from(sign(key, profileId, path));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
};

export { entrySigned };
