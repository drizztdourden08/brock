/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { UpdaterStoreState } from './updater-store.type';
import { UPDATER_IDLE } from './updater-store.constants';
import { connectUpdater } from './connect-updater';
import { messageOf } from './message-of';
import { updaterApi } from './updater-api';

const useUpdaterStore = create<UpdaterStoreState>()((set, get) => ({
  ...UPDATER_IDLE,

  connect: () => connectUpdater(updaterApi(), set),

  check: async () => {
    const api = updaterApi();
    if (!api || !get().capabilities.canCheck) return;
    set({ status: 'checking', error: null });
    try {
      const info = await api.check();
      if (!info && get().status === 'checking') set({ status: 'idle', info: null });
    } catch (err) {
      set({ status: 'error', error: messageOf(err) });
    }
  },

  loadVersions: async () => {
    const api = updaterApi();
    if (api) set({ versions: await api.listVersions() });
  },

  setPrefs: async (prefs) => {
    const api = updaterApi();
    if (!api) return;
    set({ prefs });
    await api.setPrefs(prefs);
    set({ versions: await api.listVersions() });
  },

  apply: async (version) => {
    set({ status: 'downloading', percent: 0, error: null });
    await updaterApi()?.apply(version);
  },

  openReleasePage: async (version) => {
    await updaterApi()?.openReleasePage(version);
  },

  openDialog: () => set({ dialogOpen: true }),

  closeDialog: () => set({ dialogOpen: false }),

  checkAndOpen: () => {
    set({ dialogOpen: true });
    void get().check();
  },
}));

export { useUpdaterStore };
