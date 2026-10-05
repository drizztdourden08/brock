/* @layer renderer-shell @kind logic */
import { tourAppState } from './tour-app-state';
import { tourProgress } from './tour-progress';
import { NO_TOUR_STATE } from './tours.constants';
import type { AppTourState } from './tour.type';
import { useTourStore } from './useTourStore';

const prepared = async (): Promise<AppTourState> => {
  try {
    return await tourAppState.prepare();
  } catch {
    return NO_TOUR_STATE;
  }
};

const loadTourState = async (live: () => boolean = () => true): Promise<void> => {
  const next = await prepared();
  if (!live()) return;
  const { progress, setLoaded } = useTourStore.getState();
  setLoaded(tourProgress.merge(next.progress, progress), next.firstUse);
};

const watchTourState = (): (() => void) => useTourStore.subscribe((state, prev) => {
  if (!state.loaded || !prev.loaded || (state.progress === prev.progress && state.firstUse === prev.firstUse)) return;
  tourAppState.save({ progress: state.progress, firstUse: state.firstUse }).catch(() => undefined);
});

const tourPersistence = { load: loadTourState, watch: watchTourState };

export { tourPersistence };
