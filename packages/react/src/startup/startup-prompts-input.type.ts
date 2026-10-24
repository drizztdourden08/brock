/* @layer renderer-shell @kind types */
import type { SettingsStore } from '../stores/settings-store.type';
import type { StartupPromptDef } from './startup.type';

interface StartupPromptsInput<S extends object> {
  ready: boolean;
  settingsStore: SettingsStore<S>;
  prompts: readonly StartupPromptDef[];
}

export type { StartupPromptsInput };
