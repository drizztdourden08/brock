/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';
import type { RecoverableState } from './documents.type';

const useRecoverableStore = create<RecoverableState>()((set, get) => ({
  snapshots: [],

  refresh: async () => {
    const documents = getPlatform().documents;
    const snapshots = documents ? await documents.recoverable().catch((): RecoverableSnapshot[] => []) : [];
    set({ snapshots });
  },

  restore: async (key) => {
    const snapshot = get().snapshots.find((entry) => entry.key === key);
    const bytes = snapshot ? await getPlatform().documents?.restoreSnapshot(key) : null;
    return snapshot && bytes ? { snapshot, bytes } : null;
  },

  discard: async (key) => {
    await getPlatform().documents?.discardSnapshot(key);
    await get().refresh();
  },
}));

export { useRecoverableStore };
