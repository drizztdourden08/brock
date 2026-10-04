/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { TitleBarMenuState } from './title-bar-item.type';

const useTitleBarMenuStore = create<TitleBarMenuState>()((set) => ({
  open: null,
  show: (open) => set({ open }),
  hide: () => set({ open: null }),
}));

export { useTitleBarMenuStore };
