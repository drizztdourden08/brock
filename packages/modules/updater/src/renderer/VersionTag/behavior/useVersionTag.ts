/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useUpdaterStore } from '../../useUpdaterStore';
import type { VersionTagModel } from '../VersionTag.type';

const useVersionTag = (): VersionTagModel => {
  const currentVersion = useUpdaterStore((s) => s.currentVersion);
  const info = useUpdaterStore((s) => s.info);
  const openDialog = useUpdaterStore((s) => s.openDialog);
  const checkAndOpen = useUpdaterStore((s) => s.checkAndOpen);

  const onOpen = useCallback(() => {
    if (info) openDialog();
    else checkAndOpen();
  }, [info, openDialog, checkAndOpen]);

  return {
    label: currentVersion ? `v${currentVersion}` : '',
    hasUpdate: info !== null,
    title: info ? `Version ${info.version} is available` : `Version ${currentVersion}: release notes and updates`,
    onOpen,
  };
};

export { useVersionTag };
