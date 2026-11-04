/* @layer core @kind logic */
import { CLAIM_MAX_BITS } from './sound-claim.constants';

const claimableIds = (ids: Iterable<number>, idCount: number): number[] => {
  const limit = Math.min(idCount, CLAIM_MAX_BITS);
  return [...ids].filter((id) => Number.isInteger(id) && id >= 0 && id < limit);
};

export { claimableIds };
