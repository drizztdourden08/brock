/* @layer renderer-shell @kind logic */
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { useTrackerMarksStore } from './behavior/useTrackerMarksStore';

const syncMarks = (): void => {
  const id = useProfilesStore.getState().active?.id ?? null;
  const marks = useTrackerMarksStore.getState();
  if (id !== marks.profileId) void marks.load(id);
};

const followProfileMarks = (): (() => void) => {
  syncMarks();
  return useProfilesStore.subscribe(syncMarks);
};

export { followProfileMarks };
