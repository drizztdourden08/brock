/* @layer renderer-shell @kind types */
import type { SettingsStore } from '../stores/settings-store.type';

interface DeveloperToolsBinding {
  get: () => boolean;
  set: (on: boolean) => void;
  subscribe: (listener: () => void) => () => void;
}

type DeveloperToolsBindingFactory = (settings: SettingsStore<object>) => DeveloperToolsBinding;

type DeveloperToolsSource = DeveloperToolsBinding | DeveloperToolsBindingFactory;

interface DeveloperToolsState {
  binding: DeveloperToolsBinding | null;
  on: boolean;
}

export type { DeveloperToolsBinding, DeveloperToolsBindingFactory, DeveloperToolsSource, DeveloperToolsState };
