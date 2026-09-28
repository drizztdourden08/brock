/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingItem, SettingLockCause } from '../settings.type';

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

interface ItemRun {
  lock: SettingLockCause | null;
  items: SettingItem[];
}

type SettingsRecord = Record<string, unknown>;

interface SettingsPageContextValue {
  variant: 'page' | 'results';
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  query: string;
}

export type { ItemGroup, ItemRun, ResolvedSection, SettingsPageContextValue, SettingsRecord };
