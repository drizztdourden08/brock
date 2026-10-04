/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ShortcutsHelpState } from './shortcuts-help.type';

const useShortcutsHelpStore = create<ShortcutsHelpState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  toggle: () => set((state) => ({ open: !state.open })),
}));

export { useShortcutsHelpStore };
