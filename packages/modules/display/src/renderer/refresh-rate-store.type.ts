/* @layer renderer-shell @kind types */
import type { RefreshRateInfo } from '../display.type';

interface RefreshRateState {
  info: RefreshRateInfo;
  reading: boolean;
  refresh: () => Promise<void>;
}

export type { RefreshRateState };
