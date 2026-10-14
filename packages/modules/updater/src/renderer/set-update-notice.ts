/* @layer renderer-shell @kind logic */
import type { UpdateNotice } from './update-notice.type';
import { useUpdaterStore } from './useUpdaterStore';

const setUpdateNotice = (notice: UpdateNotice | null): (() => void) => {
  useUpdaterStore.getState().setNotice(notice);
  return () => {
    if (useUpdaterStore.getState().notice === notice) useUpdaterStore.getState().setNotice(null);
  };
};

export { setUpdateNotice };
