/* @layer electron-main @kind types */
import type { BootTimeline } from '@drizztdourden08/brock-core/boot';
import type { ReviewApp, ReviewCheck, ReviewLogLine, ReviewRun, ReviewStepRecord } from '@drizztdourden08/brock-core/review';

interface ReviewSessionInput {
  name: string;
  app: ReviewApp;
  windowIcon: string | null;
}

interface ReviewSession {
  dir: string;
  run: () => ReviewRun;
  nextStep: (name: string) => ReviewStepRecord;
  splashStep: (name: string) => ReviewStepRecord;
  addCheck: (check: ReviewCheck) => void;
  addConsoleError: (message: string) => void;
  addFailedLoad: (message: string) => void;
  markLoaded: (url: string) => void;
  addRequestError: (url: string, message: string) => void;
  addMainLine: (line: ReviewLogLine) => void;
  setBoot: (timeline: BootTimeline) => void;
}

export type { ReviewSession, ReviewSessionInput };
