/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { RenderControl, RunSettingActionOptions, SettingAction, SettingItem, SettingLockCause, SettingsPatch } from '../settings.type';

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
  rowsOf: (item: SettingItem) => SettingsSectionRow[];
}

type BusyActions = Readonly<Record<string, true>>;

interface ActionRunner {
  busy: BusyActions;
  run: (key: string, action: SettingAction, options?: RunSettingActionOptions) => Promise<void>;
}

interface RowActionScope {
  id: string;
  runner: ActionRunner;
}

interface SettingRowContext<S extends object> {
  settings: S;
  onChange: SettingsPatch<S>;
  renderControl?: RenderControl<S>;
  disabled: boolean;
  lock: SettingLockCause | null;
  runner?: ActionRunner;
}

interface SettingsPageContextValue {
  variant: 'page' | 'results';
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  query: string;
}

export type { ActionRunner, BusyActions, GroupListInput, ItemGroup, ResolvedSection, RowActionScope, SettingRowContext, SettingsPageContextValue, SettingsRecord };
