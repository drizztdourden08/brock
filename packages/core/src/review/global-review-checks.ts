/* @layer core @kind logic */
import { bootReviewChecks } from './boot-review-checks';
import { GLOBAL_STEP, ICON_WARNING } from './review.constants';
import type { ReviewCheck, ReviewEnding, ReviewRun } from './review.type';

const countOf = (items: readonly string[], what: string): string =>
  (items.length === 1 ? `1 ${what}: ${items[0]}` : `${items.length} ${what}s, first: ${items[0]}`);

const noneOf = (id: string, items: readonly string[], what: string): ReviewCheck => ({
  id,
  step: GLOBAL_STEP,
  pass: items.length === 0,
  reason: items.length === 0 ? `no ${what}s` : countOf(items, what),
});

const iconCheck = (run: ReviewRun): ReviewCheck => {
  const warning = run.mainLog.find((line) => ICON_WARNING.test(line.message));
  if (run.windowIcon) return { id: 'window-icon', step: GLOBAL_STEP, pass: true, reason: `window icon resolved: ${run.windowIcon}` };
  return { id: 'window-icon', step: GLOBAL_STEP, pass: false, reason: warning?.message ?? 'no window icon was resolved' };
};

const globalReviewChecks = (run: ReviewRun, ending: ReviewEnding): ReviewCheck[] => [
  {
    id: 'tour-finished',
    step: GLOBAL_STEP,
    pass: ending.finished,
    reason: ending.finished ? `${run.steps.length} steps captured` : `the tour stopped after ${run.steps.length} steps and never reported done`,
  },
  {
    id: 'app-version',
    step: GLOBAL_STEP,
    pass: run.app.version !== run.app.electron,
    reason: run.app.version === run.app.electron
      ? `the app reports the Electron version ${run.app.electron}; Electron found no app package.json`
      : `the app reports version ${run.app.version}`,
  },
  noneOf('console-errors', run.consoleErrors, 'renderer console error'),
  noneOf('failed-loads', run.failedLoads, 'failed load'),
  noneOf('main-log-errors', run.mainLog.filter((line) => line.level === 'error').map((line) => line.message), 'main log error'),
  iconCheck(run),
  ...(run.boot ? bootReviewChecks(run.boot) : []),
];

export { globalReviewChecks };
