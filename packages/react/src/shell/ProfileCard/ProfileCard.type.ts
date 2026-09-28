/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';

interface ProfileCardProps {
  profile: Profile;
  subtitle?: ReactNode;
  selected?: boolean;
  onSelect: (profile: Profile) => void;
  onDelete?: (profile: Profile) => void;
}

export type { ProfileCardProps };
