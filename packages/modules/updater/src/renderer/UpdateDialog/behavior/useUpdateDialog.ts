/* @layer renderer-shell @kind hook */
import { useCallback, useRef } from 'react';
import type { UpdateDialogModel } from '../UpdateDialog.type';
import { useUpdaterStore } from '../../useUpdaterStore';
import { isBusy } from './is-busy';
import { useVersionChoice } from './useVersionChoice';

const useUpdateDialog = (): UpdateDialogModel => {
  const store = useUpdaterStore();
  const { dialogOpen, info, versions, capabilities, loadVersions, setPrefs } = store;
  const confirmRef = useRef<HTMLButtonElement>(null);
  const choice = useVersionChoice({ open: dialogOpen, info, versions, loadVersions });

  const onAllowPrerelease = useCallback((allowPrerelease: boolean) => {
    void setPrefs({ allowPrerelease });
  }, [setPrefs]);

  return {
    store,
    choice,
    confirmRef,
    onAllowPrerelease,
    busy: isBusy(store.status),
    notes: choice.chosen?.releaseNotes ?? info?.releaseNotes ?? '',
    showPicker: capabilities.canInstall && choice.groups.length > 0,
    showPrereleaseNote: choice.chosen?.prerelease === true,
    showFootnote: capabilities.canCheck,
  };
};

export { useUpdateDialog };
