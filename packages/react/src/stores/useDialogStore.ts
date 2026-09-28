/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { DialogState } from './dialog.type';

const useDialogStore = create<DialogState>()((set, get) => ({
  dialog: null,
  show: (config) => set({ dialog: config }),
  dismiss: () => {
    get().dialog?.onCancel?.();
    set({ dialog: null });
  },
}));

export { useDialogStore };
