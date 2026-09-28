/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BootProgressState } from './boot-progress.type';

const useBootProgressStore = create<BootProgressState>()((set) => ({
  phase: 'idle',
  message: '',
  ratio: null,
  update: (patch) => set(patch),
  reset: () => set({ phase: 'idle', message: '', ratio: null }),
}));

export { useBootProgressStore };
