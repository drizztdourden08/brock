/* @layer electron-main @kind logic */
import type { LockInput } from './open.type';

const shouldLockInstance = ({ wanted, targets, automation, namedInstance }: LockInput): boolean => {
  if (wanted === false || automation || namedInstance) return false;
  return wanted === true || targets.schemes.length > 0 || targets.extensions.length > 0;
};

export { shouldLockInstance };
