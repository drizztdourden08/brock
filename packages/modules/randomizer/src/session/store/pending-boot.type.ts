/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../augment';

interface PendingBoot {
  profileId: string;
  mode: string;
  config: RandomizerProfileConfig;
  placement?: unknown;
}

export type { PendingBoot };
