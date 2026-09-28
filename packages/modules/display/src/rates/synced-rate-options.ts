/* @layer core @kind logic */
import { BASE_HZ, HZ_TOLERANCE } from './rates.constants';

const syncedRateOptions = (hz: number | null): number[] => {
  if (hz === null || hz <= 0) return [];
  const ceiling = Math.floor((hz + HZ_TOLERANCE) / BASE_HZ);
  return Array.from({ length: Math.max(0, ceiling) }, (_, i) => (i + 1) * BASE_HZ);
};

export { syncedRateOptions };
