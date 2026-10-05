/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { EMPTY_PROGRESS, NO_TOURS } from './tours.constants';
import type { TourState } from './tour.type';

const useTourStore = create<TourState>()((set) => ({
  tours: NO_TOURS,
  active: null,
  progress: EMPTY_PROGRESS,
  progressFor: null,
  setTours: (tours) => set({ tours }),
  setActive: (active) => set({ active }),
  setProgress: (progress, profileId) => set(profileId === undefined ? { progress } : { progress, progressFor: profileId }),
}));

export { useTourStore };
