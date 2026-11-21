/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ComponentType } from 'react';
import type { OptionTabProps } from '../../../../contract/randomizer-views.type';

interface AsideTabEntry {
  id: string;
  label: Text;
}

interface AsideTab {
  Side?: ComponentType<OptionTabProps>;
  Body?: ComponentType<OptionTabProps>;
  extra: AsideTabEntry[];
  choose(id: string): void;
}

export type { AsideTab };
