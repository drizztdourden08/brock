/* @layer renderer-shell @kind logic */
import { FPS_VALUE, PERFORMANCE_ROWS, PROCESS_COUNT_VALUE } from '../review.constants';
import type { PerformanceSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const changedRows = (snapshot: PerformanceSnapshot): string[] =>
  Object.keys(snapshot.after).filter((label) => snapshot.before[label] !== undefined && snapshot.before[label] !== snapshot.after[label]);

const performanceChecks = (snapshot: PerformanceSnapshot): ReviewOutcome[] => {
  const fps = snapshot.after[PERFORMANCE_ROWS.frameRate] ?? '(no row)';
  const processes = snapshot.after[PERFORMANCE_ROWS.allProcesses] ?? '(no row)';
  const changed = changedRows(snapshot);
  return [
    outcome('performance-sampling', snapshot.sampling, 'the performance widget is sampling while shown', 'the performance widget shows "Paused" while it is on screen'),
    outcome('performance-frame-rate', FPS_VALUE.test(fps), `the frame rate reads ${fps}`, `the frame rate reads "${fps}", expected fps as a number`),
    outcome('performance-processes', PROCESS_COUNT_VALUE.test(processes), `the process row reads ${processes}`, `the process row reads "${processes}", expected the process count from main`),
    outcome('performance-live', changed.length > 0, `the numbers moved between two reads (${changed.slice(0, 3).join(', ')})`, 'no number changed between two reads; the widget is not refreshing'),
  ];
};

export { performanceChecks };
