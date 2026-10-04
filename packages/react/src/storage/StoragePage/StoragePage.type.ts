/* @layer renderer-shell @kind types */
import type { DataDomainDef, DataExportFormat, DataLocation, DomainUsage } from '@drizztdourden08/brock-core';
import type { SettingAction } from '../../settings/settings.type';
import type { ActionRunner } from '../../settings/SettingsLayout/SettingsLayout.type';

interface StoragePageProps {
  domains?: readonly string[];
}

interface StorageDomainsState {
  available: boolean;
  location: DataLocation | null;
  domains: DataDomainDef[];
  usage: Partial<Record<string, DomainUsage>>;
  error: string | null;
  refresh: (domain?: string) => void;
}

interface StorageActions {
  revealRoot: () => Promise<void>;
  reveal: (domain: DataDomainDef) => Promise<void>;
  clean: (domain: DataDomainDef, olderThanDays: number | null) => Promise<void>;
  exportTo: (format: DataExportFormat, domains: readonly string[]) => Promise<void>;
  importFrom: (format: DataExportFormat) => Promise<void>;
}

interface StorageSectionsInput {
  state: StorageDomainsState;
  actions: StorageActions;
  chosen: readonly string[];
  onChoose: (next: readonly string[]) => void;
  runner?: ActionRunner;
}

interface ActionRowInput {
  id: string;
  title: string;
  description: string;
  hint: string;
  actions: readonly SettingAction[];
  runner?: ActionRunner;
}

export type { ActionRowInput, StorageActions, StorageDomainsState, StoragePageProps, StorageSectionsInput };
