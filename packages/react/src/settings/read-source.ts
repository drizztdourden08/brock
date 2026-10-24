/* @layer renderer-shell @kind logic */
import type { SettingValues, SettingsValueSource } from './settings.type';

const readSource = (source: SettingsValueSource, keys: readonly string[]): SettingValues =>
  Object.fromEntries(keys.map((key) => [key, source.get(key)]));

export { readSource };
