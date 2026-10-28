/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { SettingsDescription, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { RenderControl, RunSettingActionOptions, SettingAction, SettingItem, SettingLockCause, SettingsPatch, SettingsValueSource } from '../settings.type';

interface ItemGroup {
  id: string | null;
  title: string | null;
  items: SettingItem[];
}

interface ResolvedSection {
  id: string;
  title: string;
  source?: SettingsValueSource;
  groups: ItemGroup[];
}

type SettingsRecord = Record<string, unknown>;

interface GroupListInput<S extends object> {
  sections: readonly ResolvedSection[];
  settings: S;
  defaults?: S;
  onChange: SettingsPatch<S>;
  lockOf: (key: string) => SettingLockCause | null;
  rowsOf: (item: SettingItem, section: ResolvedSection) => SettingsSectionRow[];
}

type BusyActions = Readonly<Record<string, true>>;

interface ActionRunner {
  busy: BusyActions;
  run: (key: string, action: SettingAction, options?: RunSettingActionOptions) => Promise<void>;
}

interface RowActionScope {
  id: string;
  runner?: ActionRunner;
}

interface SettingsRowReset {
  changed: boolean;
  onReset: () => void;
}

interface SettingRowContext<S extends object> {
  settings: S;
  defaults?: S;
  onChange: SettingsPatch<S>;
  renderControl?: RenderControl<S>;
  disabled: boolean;
  lock: SettingLockCause | null;
  runner?: ActionRunner;
}

interface RowShared {
  id: string;
  title: string;
  hint?: string;
  keywords?: string;
  lock: SettingLockCause | null;
}

interface ControlRowInput {
  shared: RowShared & SettingsDescription;
  settings: object;
  disabled: boolean;
  runner?: ActionRunner;
}

interface SettingsPageContextValue {
  variant: 'page' | 'results';
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  query: string;
}

export type { ActionRunner, BusyActions, ControlRowInput, GroupListInput, ItemGroup, ResolvedSection, RowActionScope, SettingRowContext, SettingsPageContextValue, SettingsRecord, SettingsRowReset };
