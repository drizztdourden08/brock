/* @layer core @kind logic */
import { globalReviewChecks } from './global-review-checks';
import type { ReviewEnding, ReviewReport, ReviewRun } from './review.type';

const buildReviewReport = (run: ReviewRun, ending: ReviewEnding): ReviewReport => {
  const checks = [...run.checks, ...globalReviewChecks(run, ending)];
  return {
    name: run.name,
    app: run.app,
    startedAt: new Date(run.startedAt).toISOString(),
    finishedAt: new Date(ending.finishedAt).toISOString(),
    durationMs: ending.finishedAt - run.startedAt,
    finished: ending.finished,
    passed: checks.every((check) => check.pass),
    steps: run.steps,
    checks,
    consoleErrors: run.consoleErrors,
    failedLoads: run.failedLoads,
    mainLog: run.mainLog,
  };
};

export { buildReviewReport };
