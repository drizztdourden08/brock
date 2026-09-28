/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';

interface ProfilesScreenProps {
  subtitleOf?: (profile: Profile) => ReactNode;
  extraFields?: ReactNode;
  canSubmit?: boolean;
  createOptions?: () => Record<string, unknown>;
}

export type { ProfilesScreenProps };
