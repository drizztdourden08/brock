/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useText } from '../../../i18n';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { watchSaveFailures } from './watch-save-failures';

const useSaveFailureToast = <S extends object>(store: SettingsStore<S>): void => {
  const text = useText();
  useEffect(() => watchSaveFailures(store, text), [store, text]);
};

export { useSaveFailureToast };
