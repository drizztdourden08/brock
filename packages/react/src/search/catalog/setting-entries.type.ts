/* @layer renderer-shell @kind types */
import type { SettingItem, SettingsValueSource } from '../../settings/settings.type';

interface EntryGroup {
  trail: string[];
  items: SettingItem[];
  source?: SettingsValueSource;
}

export type { EntryGroup };
