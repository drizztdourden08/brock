/* @layer electron-main @kind logic */
import { GLOBAL_STEP } from '@drizztdourden08/brock-core/review';
import type { BaselineResult } from '@drizztdourden08/brock-core/review';
import { listBaselines } from './list-baselines';
import { PNG_EXTENSION } from './review-baselines.constants';

const unusedBaselines = async (setDir: string, captured: ReadonlySet<string>, finished: boolean): Promise<BaselineResult[]> => {
  if (!finished) return [];
  const stored = await listBaselines(setDir);
  return stored.filter((key) => !captured.has(key)).map((key) => ({
    capture: key,
    step: GLOBAL_STEP,
    file: `${key}${PNG_EXTENSION}`,
    status: 'unused',
    diffPixels: 0,
    ratio: 0,
    tolerance: 0,
    masked: 0,
  }));
};

export { unusedBaselines };
