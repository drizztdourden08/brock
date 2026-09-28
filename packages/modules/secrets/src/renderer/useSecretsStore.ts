/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { SecretsState } from './secrets-store.type';
import { secretsApi } from './secrets-api';

const useSecretsStore = create<SecretsState>()((set, get) => ({
  metas: [],
  canStore: false,
  loaded: false,

  refresh: async () => {
    const api = secretsApi();
    if (!api) {
      set({ metas: [], canStore: false, loaded: true });
      return;
    }
    const [metas, canStore] = await Promise.all([api.list(), api.canStore()]);
    set({ metas, canStore, loaded: true });
  },

  set: async (name, value, label) => {
    const api = secretsApi();
    if (!api) throw new Error('Secrets need the desktop app.');
    await api.set(name, value, label);
    await get().refresh();
  },

  remove: async (name) => {
    const api = secretsApi();
    if (!api) return;
    await api.delete(name);
    await get().refresh();
  },
}));

export { useSecretsStore };
