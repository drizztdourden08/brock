/* @layer core @kind types */
import type { BootTimeline } from '../boot/boot-task.type';

type ReviewLogLevel = 'warn' | 'error';

interface ReviewCheck {
  id: string;
  step: string;
  pass: boolean;
  reason: string;
}

interface ReviewStepRecord {
  index: number;
  name: string;
  file: string;
}

interface ReviewLogLine {
  level: ReviewLogLevel;
  message: string;
}

interface ReviewApp {
  name: string;
  version: string;
  electron: string;
}

interface ReviewRun {
  name: string;
  app: ReviewApp;
  startedAt: number;
  steps: ReviewStepRecord[];
  checks: ReviewCheck[];
  consoleErrors: string[];
  failedLoads: string[];
  mainLog: ReviewLogLine[];
  windowIcon: string | null;
  boot?: BootTimeline;
}

interface ReviewEnding {
  finished: boolean;
  finishedAt: number;
}

interface ReviewReport {
  name: string;
  app: ReviewApp;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  finished: boolean;
  passed: boolean;
  steps: ReviewStepRecord[];
  checks: ReviewCheck[];
  consoleErrors: string[];
  failedLoads: string[];
  mainLog: ReviewLogLine[];
}

export type { ReviewApp, ReviewCheck, ReviewEnding, ReviewLogLevel, ReviewLogLine, ReviewReport, ReviewRun, ReviewStepRecord };
