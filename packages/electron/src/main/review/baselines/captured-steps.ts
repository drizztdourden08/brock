/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { join } from 'path';
import { baselineKeys } from '@drizztdourden08/brock-core/review';
import type { ReviewStepRecord } from '@drizztdourden08/brock-core/review';

const capturedSteps = (steps: readonly ReviewStepRecord[], reviewDir: string): { step: ReviewStepRecord; key: string }[] => {
  const keys = baselineKeys(steps);
  return steps.flatMap((step) => {
    const key = keys.get(step.file);
    return key !== undefined && existsSync(join(reviewDir, step.file)) ? [{ step, key }] : [];
  });
};

export { capturedSteps };
