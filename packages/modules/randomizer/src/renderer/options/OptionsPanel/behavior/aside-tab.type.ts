/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { OptionTabProps } from '../../../../contract/randomizer-views.type';

interface AsideTabEntry {
  id: string;
  label: string;
}

interface AsideTab {
  Side?: ComponentType<OptionTabProps>;
  Body?: ComponentType<OptionTabProps>;
  extra: AsideTabEntry[];
  choose(id: string): void;
}

export type { AsideTab };
