/* @layer core @kind types */
import type { ApGameData } from '../protocol/protocol.type';

interface CacheSplit {
  cached: Record<string, ApGameData>;
  missing: string[];
}

export type { CacheSplit };
