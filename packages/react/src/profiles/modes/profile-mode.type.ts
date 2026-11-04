/* @layer renderer-shell @kind types */
import type { Profile } from '@drizztdourden08/brock-core';

interface ProfileModeDef {
  id: string;
  label: string;
  monogram: string;
  rank: number;
  matches: (profile: Profile, config: Record<string, unknown> | null) => boolean;
}

export type { ProfileModeDef };
