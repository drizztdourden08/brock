/* @layer renderer-shell @kind logic */
import { profileViews } from '../widgets/profile-views';
import { tourProgress } from './tour-progress';
import { EMPTY_PROGRESS } from './tours.constants';
import { useTourStore } from './useTourStore';

const loadTourProgress = async (profileId: string | null, live: () => boolean = () => true): Promise<void> => {
  const store = useTourStore.getState();
  store.setActive(null);
  store.setProgress(EMPTY_PROGRESS, null);
  if (!profileId) return;
  const views = await profileViews.read(profileId);
  if (live()) useTourStore.getState().setProgress(tourProgress.read(views.tours), profileId);
};

const watchTourProgress = (): (() => void) => useTourStore.subscribe((state, prev) => {
  if (state.progress === prev.progress || state.progressFor === null || state.progressFor !== prev.progressFor) return;
  void profileViews.patch(state.progressFor, { tours: state.progress });
});

const tourPersistence = { load: loadTourProgress, watch: watchTourProgress };

export { tourPersistence };
