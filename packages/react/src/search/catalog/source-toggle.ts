/* @layer renderer-shell @kind logic */
import type { SettingsValueSource } from '../../settings/settings.type';
import type { SearchToggle } from '../search.type';

const sourceToggle = (key: string, source: SettingsValueSource): SearchToggle | undefined => {
  const value = source.get(key);
  return typeof value === 'boolean' ? { value, flip: () => void source.set(key, !value) } : undefined;
};

export { sourceToggle };
