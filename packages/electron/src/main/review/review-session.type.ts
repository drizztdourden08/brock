/* @layer electron-main @kind types */
import type { BootTimeline } from '@drizztdourden08/brock-core/boot';
import type { MaskRect, ReviewApp, ReviewCheck, ReviewLogLine, ReviewRun, ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import type { BaselineOptions } from './baselines/baseline-options.type';

interface ReviewSessionInput {
  name: string;
  app: ReviewApp;
  windowIcon: string | null;
  baselines?: BaselineOptions | null;
}

interface ReviewSession {
  dir: string;
  baselines: BaselineOptions | null;
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
  addMasks: (file: string, rects: readonly MaskRect[]) => void;
  masksOf: (file: string) => readonly MaskRect[];
  markUnsettled: (file: string) => void;
  settled: (file: string) => boolean;
}

export type { ReviewSession, ReviewSessionInput };
