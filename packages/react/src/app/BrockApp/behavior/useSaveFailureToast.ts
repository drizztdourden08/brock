/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { watchSaveFailures } from './watch-save-failures';

const useSaveFailureToast = <S extends object>(store: SettingsStore<S>): void => {
  useEffect(() => watchSaveFailures(store), [store]);
};

export { useSaveFailureToast };
