/* @layer electron-main @kind types */
import type { BaselineConfig, BaselineMode, MaskRect, ReviewStepRecord } from '@drizztdourden08/brock-core/review';

interface BaselineOptions {
  mode: BaselineMode;
  root: string;
  setDir: string;
  setLabel: string;
  force: boolean;
  platform: string;
  config: BaselineConfig;
}

interface BaselineRunInput {
  steps: readonly ReviewStepRecord[];
  reviewDir: string;
  finished: boolean;
  masksOf: (file: string) => readonly MaskRect[];
  settled: (file: string) => boolean;
  failedChecks: readonly string[];
}

export type { BaselineOptions, BaselineRunInput };
