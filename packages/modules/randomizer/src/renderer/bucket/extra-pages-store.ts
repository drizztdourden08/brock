/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { LivePage } from '@drizztdourden08/brock-react';

interface ExtraPagesState {
  pages: readonly LivePage[];
  add: (pages: readonly LivePage[]) => void;
}

const useExtraPagesStore = create<ExtraPagesState>((set) => ({
  pages: [],
  add: (pages) => set((state) => ({ pages: [...state.pages.filter((p) => !pages.some((q) => q.key === p.key)), ...pages] })),
}));

export { useExtraPagesStore };
