/* @layer renderer-shell @kind hook */
import { useContext } from 'react';
import { SettingsStoreContext } from './settings-context';
import type { SettingsStore } from './settings-store.type';

const useSettingsStore = <S extends object>(): SettingsStore<S> => {
  const store = useContext(SettingsStoreContext);
  if (!store) throw new Error('useSettings must be used within <BrockApp>');
  return store as SettingsStore<S>;
};

export { useSettingsStore };
