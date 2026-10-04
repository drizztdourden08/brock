/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { RenderControl, SettingItem, SettingLockCause, SettingsPatch } from '../settings.type';

interface ItemGroup {
  id: string | null;
  title: string | null;
  items: SettingItem[];
}

interface ResolvedSection {
  id: string;
  title: string;
  groups: ItemGroup[];
}

type SettingsRecord = Record<string, unknown>;

interface GroupListInput<S extends object> {
  sections: readonly ResolvedSection[];
  settings: S;
  defaults?: S;
  onChange: SettingsPatch<S>;
  lockOf: (key: string) => SettingLockCause | null;
  rowOf: (item: SettingItem) => SettingsSectionRow | null;
}

interface SettingRowContext<S extends object> {
  settings: S;
  onChange: SettingsPatch<S>;
  renderControl?: RenderControl<S>;
  disabled: boolean;
  lock: SettingLockCause | null;
}

interface SettingsPageContextValue {
  variant: 'page' | 'results';
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  query: string;
}

export type { GroupListInput, ItemGroup, ResolvedSection, SettingRowContext, SettingsPageContextValue, SettingsRecord };
