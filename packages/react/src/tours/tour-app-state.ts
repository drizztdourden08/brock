/* @layer renderer-shell @kind logic */
import type { AppState } from '@drizztdourden08/brock-core';
import { listProfiles } from '../profiles/list-profiles';
import { updateAppState } from '../profiles/update-app-state';
import { profileViews } from '../widgets/profile-views';
import { tourProgress } from './tour-progress';
import { PROFILE_TOURS_FIELD } from './tours.constants';
import type { AppTourState, TourProgress } from './tour.type';

const countProfiles = async (): Promise<number> => {
  try {
    return (await listProfiles()).length;
  } catch {
    return 0;
  }
};

const settle = (state: AppState, moved: readonly TourProgress[], existing: boolean): AppState => {
  const firstRun = state.firstRun ?? (existing ? 'done' : 'pending');
  if (moved.length === 0 && firstRun === state.firstRun) return state;
  return { ...state, firstRun, tours: moved.reduce(tourProgress.merge, tourProgress.read(state.tours)) };
};

const prepare = async (): Promise<AppTourState> => {
  const [views, profiles] = await Promise.all([profileViews.take(PROFILE_TOURS_FIELD), countProfiles()]);
  const moved = views.taken.map(tourProgress.read);
  const state = await updateAppState((current) => settle(current, moved, profiles > 0 || views.found));
  if (views.taken.length > 0) profileViews.flush();
  return { progress: tourProgress.read(state.tours), firstUse: state.firstRun === 'pending' };
};

const save = (next: AppTourState): Promise<AppState> =>
  updateAppState((state) => ({ ...state, tours: next.progress, firstRun: next.firstUse && state.firstRun !== 'done' ? 'pending' : 'done' }));

const tourAppState = { prepare, save };

export { tourAppState };
