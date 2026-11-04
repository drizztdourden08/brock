/* @layer core @kind logic */
import { FNV_OFFSET, FNV_PRIME, NO_ROOM_HASH, ZERO_HASH_STAND_IN } from './room-hash.constants';

const roomHashOf = (seedName: string): string => {
  if (seedName === '') return '';
  let hash = FNV_OFFSET;
  for (const byte of new TextEncoder().encode(seedName)) {
    hash = Math.imul(hash ^ byte, FNV_PRIME) >>> 0;
  }
  return String(hash === NO_ROOM_HASH ? ZERO_HASH_STAND_IN : hash);
};

export { roomHashOf };
