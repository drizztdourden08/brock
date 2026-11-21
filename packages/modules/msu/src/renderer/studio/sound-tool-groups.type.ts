/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';

type SoundToolGroupsProps = {
  tabs: ReactNode;
  placeholder: string;
  unreachableCount: number;
  filter: string;
  showUnreachable: boolean;
  onFilterChange: (filter: string) => void;
  onShowUnreachableChange: (show: boolean) => void;
  t: I18n['t'];
};

export type { SoundToolGroupsProps };
