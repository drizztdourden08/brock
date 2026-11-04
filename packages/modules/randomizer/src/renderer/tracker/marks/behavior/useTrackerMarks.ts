/* @layer renderer-shell @kind hook */
import type { TrackerMarks } from '../tracker-marks.type';
import { useTrackerMarksStore } from './useTrackerMarksStore';

const useTrackerMarks = (): TrackerMarks => {
  const marks = useTrackerMarksStore((state) => state.marks);
  const toggle = useTrackerMarksStore((state) => state.toggle);
  return { marks, toggle };
};

export { useTrackerMarks };
