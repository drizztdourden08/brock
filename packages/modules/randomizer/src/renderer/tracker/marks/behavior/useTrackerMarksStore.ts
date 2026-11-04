/* @layer renderer-shell @kind logic */
import { create } from 'zustand';
import { readTrackerMarks } from '../read-tracker-marks';
import { EMPTY_MARKS } from '../tracker-marks.constants';
import type { TrackerMarksState } from '../tracker-marks-state.type';
import { writeTrackerMarks } from '../write-tracker-marks';

const useTrackerMarksStore = create<TrackerMarksState>((set, get) => ({
  profileId: null,
  marks: EMPTY_MARKS,
  load: async (profileId) => {
    set({ profileId, marks: EMPTY_MARKS });
    if (profileId === null) return;
    const marks = await readTrackerMarks(profileId);
    if (get().profileId === profileId) set({ marks });
  },
  toggle: (location) => {
    const { profileId, marks } = get();
    if (profileId === null) return;
    const next = new Set(marks);
    if (!next.delete(location)) next.add(location);
    set({ marks: next });
    void writeTrackerMarks(profileId, next);
  },
}));

export { useTrackerMarksStore };
