/* @layer renderer-shell @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface ProfileModeDef {
  id: string;
  label: Text;
  monogram: string;
  rank: number;
  matches: (profile: Profile, config: Record<string, unknown> | null) => boolean;
}

export type { ProfileModeDef };
