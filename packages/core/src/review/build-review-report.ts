/* @layer core @kind logic */
import { baselineChecks } from './baseline-checks';
import { globalReviewChecks } from './global-review-checks';
import type { ReviewEnding, ReviewReport, ReviewRun } from './review.type';

const buildReviewReport = (run: ReviewRun, ending: ReviewEnding): ReviewReport => {
  const checks = [...run.checks, ...globalReviewChecks(run, ending), ...(run.baselines ? baselineChecks(run.baselines) : [])];
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
    ...(run.baselines ? { baselines: run.baselines } : {}),
  };
};

export { buildReviewReport };
