/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { EMPTY_PROGRESS, NO_TOURS } from './tours.constants';
import type { TourState } from './tour.type';

const useTourStore = create<TourState>()((set) => ({
  tours: NO_TOURS,
  active: null,
  progress: EMPTY_PROGRESS,
  loaded: false,
  firstUse: false,
  shown: null,
  spot: null,
  clickRelay: null,
  setTours: (tours) => set({ tours }),
  setActive: (active) => set({ active }),
  setProgress: (progress) => set({ progress }),
  setLoaded: (progress, firstUse) => set({ progress, firstUse, loaded: true }),
  setFirstUse: (firstUse) => set({ firstUse }),
  setShown: (shown) => set({ shown }),
  setSpot: (spot) => set({ spot }),
  setClickRelay: (clickRelay) => set({ clickRelay }),
}));

export { useTourStore };
