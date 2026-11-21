/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';

type FileToolGroupsProps = {
  tabs: ReactNode;
  filter: string;
  coveredCount: number;
  supersededOnly: boolean;
  onFilterChange: (filter: string) => void;
  onSupersededOnlyChange: (checked: boolean) => void;
  t: I18n['t'];
};

export type { FileToolGroupsProps };
