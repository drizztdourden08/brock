/* @layer renderer-shell @kind hook */
import type { UseSettingsResult } from './settings-store.type';
import { useSettingsStore } from './useSettingsStore';

const useSettings = <S extends object>(): UseSettingsResult<S> => {
  const store = useSettingsStore<S>();
  const settings = store((s) => s.settings);
  const patch = store((s) => s.patch);
  const hydrated = store((s) => s.hydrated);
  return { settings, patch, hydrated };
};

export { useSettings };
