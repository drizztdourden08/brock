/* @layer renderer-shell @kind hook */
import { useCallback, useContext, useSyncExternalStore } from 'react';
import { SettingsStoreContext } from './settings-context';

const useSettingValue = (key: string): unknown => {
  const store = useContext(SettingsStoreContext);
  const subscribe = useCallback((onChange: () => void) => store?.subscribe(onChange) ?? (() => undefined), [store]);
  const read = useCallback((): unknown => {
    const settings = store?.getState().settings ?? {};
    return Object.entries(settings).find(([name]) => name === key)?.[1];
  }, [store, key]);
  return useSyncExternalStore(subscribe, read);
};

export { useSettingValue };
