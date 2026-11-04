/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { ExtraPagesState } from '../extra-pages-store.type';
import { mergeExtraPages } from '../merge-extra-pages';

const useExtraPagesStore = create<ExtraPagesState>((set) => ({
  pages: [],
  add: (pages) => set((state) => ({ pages: mergeExtraPages(state.pages, pages) })),
}));

export { useExtraPagesStore };
