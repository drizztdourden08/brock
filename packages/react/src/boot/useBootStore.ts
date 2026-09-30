/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { BootState } from './renderer-boot.type';

const useBootStore = create<BootState>()((set) => ({
  phase: 'running',
  failure: null,
  setPhase: (phase) => set({ phase }),
  fail: (failure) => set({ phase: 'failed', failure }),
}));

export { useBootStore };
