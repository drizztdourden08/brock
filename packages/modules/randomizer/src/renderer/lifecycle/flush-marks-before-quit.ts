/* @layer renderer-shell @kind logic */
import type { OnBeforeQuit } from '@drizztdourden08/brock-react';
import { flushTrackerMarks } from '../tracker/marks/flush-tracker-marks';

const flushMarksBeforeQuit: OnBeforeQuit = async () => {
  await flushTrackerMarks();
  return 'quit';
};

export { flushMarksBeforeQuit };
