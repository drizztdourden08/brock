/* @layer electron-main @kind logic */
import type { ReviewLogLine, ReviewRun } from '@drizztdourden08/brock-core/review';
import { reviewStepFile } from '@drizztdourden08/brock-core/review';
import { getUserDataPath } from '../paths/get-user-data-path';
import type { ReviewSession, ReviewSessionInput } from './review-session.type';

const addOnce = (list: string[], message: string): void => {
  if (!list.includes(message)) list.push(message);
};

const sameLine = (a: ReviewLogLine, b: ReviewLogLine): boolean => a.level === b.level && a.message === b.message;

const createReviewSession = ({ name, app, windowIcon }: ReviewSessionInput): ReviewSession => {
  const run: ReviewRun = {
    name, app, windowIcon,
    startedAt: Date.now(),
    steps: [],
    checks: [],
    consoleErrors: [],
    failedLoads: [],
    mainLog: [],
  };
  const loaded = new Set<string>();
  const requestErrors = new Map<string, string>();
  const unresolved = (): string[] => [...requestErrors].filter(([url]) => !loaded.has(url)).map(([, message]) => message);
  return {
    dir: getUserDataPath('review', name),
    run: () => ({ ...run, failedLoads: [...run.failedLoads, ...unresolved()] }),
    markLoaded: (url) => { loaded.add(url); },
    addRequestError: (url, message) => { if (!requestErrors.has(url)) requestErrors.set(url, message); },
    nextStep: (step) => {
      const index = run.steps.filter((seen) => seen.index > 0).length + 1;
      const record = { index, name: step, file: reviewStepFile(index, step) };
      run.steps.push(record);
      return record;
    },
    splashStep: (step) => {
      const record = { index: 0, name: step, file: reviewStepFile(0, step) };
      run.steps.unshift(record);
      return record;
    },
    addCheck: (check) => { run.checks.push(check); },
    addConsoleError: (message) => addOnce(run.consoleErrors, message),
    addFailedLoad: (message) => addOnce(run.failedLoads, message),
    addMainLine: (line) => {
      if (!run.mainLog.some((seen) => sameLine(seen, line))) run.mainLog.push(line);
    },
    setBoot: (timeline) => { run.boot = timeline; },
  };
};

export { createReviewSession };
