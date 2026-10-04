/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import { restoreNavigation } from '../navigation/restore-navigation';
import { readSavedNavigation } from '../navigation/read-saved-navigation';
import { useNavigationStore } from '../navigation/useNavigationStore';
import type { ScreenStates, ScreenViews } from '../stores/screen-state.type';
import { useScreenStateStore } from '../stores/useScreenStateStore';
import { profileViews } from '../widgets/profile-views';
import type { ScreenRestore } from './screen-state.type';

const bound: { profileId: string | null } = { profileId: null };

const saneStates = (stored: unknown): ScreenStates =>
  (isRecord(stored) ? Object.fromEntries(Object.entries(stored).filter((entry): entry is [string, Record<string, unknown>] => isRecord(entry[1]))) : {});

const screenViews = (): ScreenViews => {
  const { active, params, history, remembered } = useNavigationStore.getState();
  return { nav: { active, params, history, remembered }, state: useScreenStateStore.getState().byScope };
};

const loadScreens = async (profileId: string | null, restore: ScreenRestore, live: () => boolean = () => true): Promise<void> => {
  bound.profileId = null;
  if (!profileId) return;
  const views = await profileViews.read(profileId);
  if (!live()) return;
  useScreenStateStore.getState().hydrate(saneStates(views.screens?.state));
  if (restore.navigation) restoreNavigation(readSavedNavigation(views.screens?.nav, restore.known), restore.homeScreen);
  bound.profileId = profileId;
};

const save = (): void => {
  const id = bound.profileId;
  if (id) void profileViews.patch(id, { screens: screenViews() });
};

const watchScreens = (): (() => void) => {
  const offNav = useNavigationStore.subscribe((state, prev) => {
    if (state.params !== prev.params || state.active !== prev.active || state.history !== prev.history || state.remembered !== prev.remembered) save();
  });
  const offState = useScreenStateStore.subscribe((state, prev) => {
    if (state.byScope !== prev.byScope) save();
  });
  return () => {
    offNav();
    offState();
  };
};

const screenPersistence = { load: loadScreens, watch: watchScreens, boundTo: (): string | null => bound.profileId };

export { screenPersistence };
