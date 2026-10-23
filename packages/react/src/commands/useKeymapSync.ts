/* @layer renderer-shell @kind hook */
import { useContext, useEffect } from 'react';
import { SettingsStoreContext } from '../stores/settings-context';
import { useSettingValue } from '../stores/useSettingValue';
import { KEYMAP_SETTING } from './commands.constants';
import { readKeymap } from './read-keymap';
import { useCommandStore } from './useCommandStore';

const useKeymapSync = (): void => {
  const store = useContext(SettingsStoreContext);
  const stored = useSettingValue(KEYMAP_SETTING);

  useEffect(() => {
    useCommandStore.setState({ overrides: readKeymap(stored) });
  }, [stored]);

  useEffect(() => {
    if (store === null) return undefined;
    useCommandStore.setState({ persist: (overrides) => store.getState().patch({ [KEYMAP_SETTING]: overrides }) });
    return () => useCommandStore.setState({ persist: null });
  }, [store]);
};

export { useKeymapSync };
