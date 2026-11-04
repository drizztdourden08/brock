/* @layer core @kind types */
import type { RandomizerProfileConfig } from '../../profile/randomizer-profile.type';

interface PendingBoot {
  profileId: string;
  mode: string;
  config: RandomizerProfileConfig;
  placement?: unknown;
}

export type { PendingBoot };
