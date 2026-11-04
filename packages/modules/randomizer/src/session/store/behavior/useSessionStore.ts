/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import type { SessionStoreState } from '../session-store.type';

const useSessionStore = create<SessionStoreState>((set) => ({
  session: null,
  placement: null,
  status: 'idle',
  setSession: (session, placement = null) => set({ session, placement }),
  setStatus: (status) => set({ status }),
}));

export { useSessionStore };
