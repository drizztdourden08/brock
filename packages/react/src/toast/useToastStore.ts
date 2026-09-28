/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { MAX_TOASTS } from './toast.constants';
import type { ToastState } from './toast.type';

const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (item) => set((state) => ({ toasts: [...state.toasts, item].slice(-MAX_TOASTS) })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export { useToastStore };
