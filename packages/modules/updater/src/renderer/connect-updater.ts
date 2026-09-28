/* @layer renderer-shell @kind logic */
import type { UpdaterApi } from '../updater.type';
import type { SetUpdater } from './updater-store.type';
import { listenUpdaterEvents } from './listen-updater-events';
import { messageOf } from './message-of';

const loadInitial = async (api: UpdaterApi, set: SetUpdater): Promise<void> => {
  const [capabilities, prefs, currentVersion, info] = await Promise.all([
    api.capabilities(), api.getPrefs(), api.getVersion(), api.getAvailable(),
  ]);
  set({ capabilities, prefs, currentVersion });
  if (info) set({ status: 'available', info, dialogOpen: true });
};

const connectUpdater = (api: UpdaterApi | null, set: SetUpdater): (() => void) => {
  if (!api) return () => undefined;
  const unsubscribe = listenUpdaterEvents(api, set);
  loadInitial(api, set).catch((err: unknown) => set({ status: 'error', error: messageOf(err) }));
  return unsubscribe;
};

export { connectUpdater };
