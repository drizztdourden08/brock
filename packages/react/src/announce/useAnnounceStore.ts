/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { AnnouncerState } from './announce.type';

const useAnnounceStore = create<AnnouncerState>()((set) => ({
  polite: '',
  assertive: '',
  setText: (politeness, text) => set({ [politeness]: text }),
}));

export { useAnnounceStore };
