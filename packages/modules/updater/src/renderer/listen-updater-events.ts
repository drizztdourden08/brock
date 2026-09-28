/* @layer renderer-shell @kind logic */
import type { UpdaterApi } from '../updater.type';
import type { SetUpdater } from './updater-store.type';

const listenUpdaterEvents = (api: UpdaterApi, set: SetUpdater): (() => void) => {
  const cleanups = [
    api.onUpdateAvailable((info) => set({ status: 'available', info, error: null })),
    api.onUpToDate(() => set({ status: 'idle', info: null })),
    api.onDownloadProgress(({ percent }) => set({ status: 'downloading', percent })),
    api.onDownloadComplete(() => set({ status: 'ready', percent: 100 })),
    api.onError((error) => set({ status: 'error', error })),
  ];
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
};

export { listenUpdaterEvents };
