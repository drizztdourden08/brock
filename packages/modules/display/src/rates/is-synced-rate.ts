/* @layer core @kind logic */
import { BASE_HZ, HZ_TOLERANCE } from './rates.constants';
import { nearestMultiple } from './nearest-multiple';

const isSyncedRate = (hz: number | null): boolean => {
  if (hz === null || hz <= 0) return false;
  return Math.abs(hz - nearestMultiple(hz) * BASE_HZ) <= HZ_TOLERANCE;
};

export { isSyncedRate };
