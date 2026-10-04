/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { toast } from '../../../toast/toast';

const useSaveFailureToast = <S extends object>(store: SettingsStore<S>): void => {
  useEffect(() => store.subscribe((state, prev) => {
    if (state.saveStatus === 'failed' && prev.saveStatus !== 'failed') {
      toast(`Settings not saved: ${state.saveError ?? 'unknown error'}. Use Retry in the settings header.`, { variant: 'danger', duration: 0 });
    }
  }), [store]);
};

export { useSaveFailureToast };
