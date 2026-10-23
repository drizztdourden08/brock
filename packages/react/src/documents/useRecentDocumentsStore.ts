/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { RecentDocument } from '@drizztdourden08/brock-core';
import { getPlatform } from '../platform/get-platform';
import type { RecentDocumentsState } from './documents.type';

const useRecentDocumentsStore = create<RecentDocumentsState>()((set, get) => ({
  recent: [],

  refresh: async () => {
    const documents = getPlatform().documents;
    const recent = documents ? await documents.recent().catch((): RecentDocument[] => []) : [];
    set({ recent });
  },

  clear: async () => {
    await getPlatform().documents?.clearRecent();
    set({ recent: [] });
  },

  open: async (path) => {
    const full = (await getPlatform().documents?.openRecent(path)) ?? null;
    await get().refresh();
    return full;
  },
}));

export { useRecentDocumentsStore };
