/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingItem, SettingLockCause, SettingsPatch } from '../settings.type';

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
  renderRow: (item: SettingItem) => ReactNode;
}

interface SettingsPageContextValue {
  variant: 'page' | 'results';
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  query: string;
}

export type { GroupListInput, ItemGroup, ResolvedSection, SettingsPageContextValue, SettingsRecord };
