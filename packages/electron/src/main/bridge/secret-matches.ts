/* @layer electron-main @kind logic */
import { createHash, timingSafeEqual } from 'crypto';

const digest = (value: string): Buffer => createHash('sha256').update(value, 'utf8').digest();

const secretMatches = (given: string, secret: string): boolean => timingSafeEqual(digest(given), digest(secret));

export { secretMatches };
